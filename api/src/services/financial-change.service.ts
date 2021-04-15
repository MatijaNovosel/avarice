import { TransactionType } from "../constants";
import { TransferInputType } from "./../input-types/financial-change.input-type";
import { PaginatedFinancialChange } from "./../models/item-collection";
import { Financialhistory } from "./../entities/financialhistory";
import {
  GDailyChange,
  RecentDepositsAndWithdrawals,
  TransactionAmountRange
} from "./../entities/paymentsource";
import { Financialchangetag } from "./../entities/financialchangetag";
import {
  Financialchange,
  GFinancialChange
} from "./../entities/financialchange";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Between,
  createQueryBuilder,
  Equal,
  getConnection,
  Like,
  Repository
} from "typeorm";
import { FinancialChangeInputType } from "../input-types/financial-change.input-type";
import { format, parse } from "date-fns";
import { Appuser } from "../entities/appuser";
import { GTag } from "src/entities/tag";

@Injectable()
export class FinancialChangeService {
  constructor(
    @InjectRepository(Financialchange)
    private financialChangeRepository: Repository<Financialchange>,
    @InjectRepository(Financialchangetag)
    private financialChangeTagRepository: Repository<Financialchangetag>,
    @InjectRepository(Financialhistory)
    private financialChangeHistoryRepository: Repository<Financialhistory>,
    @InjectRepository(Appuser)
    private appUserRepository: Repository<Appuser>
  ) {}

  async getRecentDepositsAndWithdrawals(
    appUserId: number
  ): Promise<RecentDepositsAndWithdrawals> {
    const { withdrawals } = await createQueryBuilder("financialchange")
      .select("ROUND(SUM(amount), 2) withdrawals")
      .where(
        `expense = 1 AND transfer = 0 AND createdAt BETWEEN NOW() - INTERVAL 30 DAY AND NOW() AND appUserId = ${appUserId}`
      )
      .getRawOne();

    const { deposits } = await createQueryBuilder("financialchange")
      .select("ROUND(SUM(amount), 2) deposits")
      .where(
        `expense = 0 AND transfer = 0 AND createdAt BETWEEN NOW() - INTERVAL 30 DAY AND NOW() AND appUserId = ${appUserId}`
      )
      .getRawOne();

    return {
      deposits,
      withdrawals
    };
  }

  async getTransactionAmountRange(
    appUserId: number,
    expense?: boolean
  ): Promise<TransactionAmountRange> {
    const { min, max } = await createQueryBuilder("financialchange")
      .select("MAX(amount) max, MIN(amount) min")
      .where({
        appUserId,
        ...(expense && { expense: expense ? 1 : 0 })
      })
      .getRawOne();

    return {
      max,
      min
    };
  }

  async findAllByUserId(
    id: number,
    skip?: number,
    take?: number,
    description?: string,
    min?: number,
    max?: number,
    tags?: number[],
    transactionType?: TransactionType,
    account?: number,
    showTransfers?: boolean
  ): Promise<PaginatedFinancialChange> {
    const range = await this.getTransactionAmountRange(id);

    const filter = {
      appUserId: id,
      amount: Between(min || range.min, max || range.max),
      ...(description && { description: Like(`%${description}%`) }),
      ...(transactionType && {
        expense: transactionType == TransactionType.DEPOSIT ? 0 : 1
      }),
      ...(account && { paymentSourceId: Equal(account) }),
      ...(showTransfers != undefined &&
        showTransfers == false && { transfer: Equal(0) })
    };

    const data = await this.financialChangeRepository.find({
      where: filter,
      order: { createdAt: "DESC" },
      skip,
      take,
      join: {
        alias: "fc",
        leftJoinAndSelect: {
          paymentSource: "fc.paymentSource",
          financialchangetags: "fc.financialchangetags",
          tag: "financialchangetags.tag"
        }
      }
    });

    let items = data.map<GFinancialChange>((transaction) => ({
      id: transaction.id,
      transfer: transaction.transfer,
      amount: transaction.amount,
      description: transaction.description,
      createdAt: format(transaction.createdAt, "dd.MM.yyyy. HH:mm:ss"),
      expense: transaction.expense,
      account: transaction.paymentSource.description,
      tags: transaction.financialchangetags.map<GTag>((fct) => ({
        id: fct.tagId,
        description: fct.tag.description
      }))
    }));

    if (tags && tags.length != 0) {
      items = items.filter(
        (x) => JSON.stringify(x.tags.map((y) => y.id)) == JSON.stringify(tags)
      );
    }

    const count = items.length;
    return new PaginatedFinancialChange(items, count);
  }

  async transfer(payload: TransferInputType): Promise<void> {
    const createdAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    const transferRecordFrom = await this.financialChangeRepository.save({
      amount: payload.amount,
      description: "Transfer",
      expense: true,
      transfer: true,
      paymentSourceId: payload.accountFromId,
      appUserId: payload.appUserId,
      createdAt
    });

    const transferRecordTo = await this.financialChangeRepository.save({
      amount: payload.amount,
      description: "Transfer",
      expense: false,
      transfer: true,
      paymentSourceId: payload.accountFromId,
      appUserId: payload.appUserId,
      createdAt
    });

    // Change tag id later to correspond to more flexible future changes - tag enumerations
    await this.financialChangeTagRepository.save({
      financialChangeId: transferRecordFrom.id,
      tagId: 8
    });

    await this.financialChangeTagRepository.save({
      financialChangeId: transferRecordTo.id,
      tagId: 8
    });

    const accountIds: number[] = (
      await this.appUserRepository.findOne({
        where: { id: payload.appUserId },
        relations: ["paymentsources"]
      })
    ).paymentsources.map((ps) => ps.id);

    for (const id of accountIds) {
      const current = await this.financialChangeHistoryRepository.findOne({
        where: { appUserId: payload.appUserId, paymentSourceId: id },
        order: { createdAt: "DESC" }
      });

      let finalAmount: number = current.amount;

      if (id == payload.accountFromId) {
        finalAmount = parseFloat((current.amount - payload.amount).toFixed(2));
      } else if (id == payload.accountToId) {
        finalAmount = parseFloat((current.amount + payload.amount).toFixed(2));
      }

      await this.financialChangeHistoryRepository.save({
        createdAt: createdAt,
        appUserId: payload.appUserId,
        paymentSourceId: id,
        amount: finalAmount
      });
    }
  }

  async create(payload: FinancialChangeInputType): Promise<void> {
    const date = parse(payload.createdAt, "dd.MM.yyyy. HH:mm:ss", new Date());
    const financialChange = await this.financialChangeRepository.save({
      amount: payload.amount,
      description: payload.description,
      expense: payload.expense,
      paymentSourceId: payload.paymentSourceId,
      appUserId: payload.appUserId,
      createdAt: format(date, "yyyy-MM-dd HH:mm:ss")
    });

    payload.tagIds.forEach(async (tagId) => {
      await this.financialChangeTagRepository.save({
        financialChangeId: financialChange.id,
        tagId
      });
    });

    const accountIds: number[] = (
      await this.appUserRepository.findOne({
        where: { id: payload.appUserId },
        relations: ["paymentsources"]
      })
    ).paymentsources.map((ps) => ps.id);

    for (const id of accountIds) {
      const current = await this.financialChangeHistoryRepository.findOne({
        where: { appUserId: payload.appUserId, paymentSourceId: id },
        order: { createdAt: "DESC" }
      });
      await this.financialChangeHistoryRepository.save({
        createdAt: format(date, "yyyy-MM-dd HH:mm:ss"),
        appUserId: payload.appUserId,
        paymentSourceId: id,
        amount:
          payload.paymentSourceId == id
            ? payload.expense
              ? parseFloat((current.amount - payload.amount).toFixed(2))
              : parseFloat((current.amount + payload.amount).toFixed(2))
            : current.amount
      });
    }
  }

  async getDailyChanges(appUserId: number): Promise<GDailyChange[]> {
    const data = await getConnection().query("CALL getDailyChanges(?)", [
      appUserId
    ]);
    return data[0];
  }
}
