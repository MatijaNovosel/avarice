import { TransferInputType } from "./../input-types/financial-change.input-type";
import { PaginatedFinancialChange } from "./../models/item-collection";
import { Financialhistory } from "./../entities/financialhistory";
import {
  GDailyChange,
  Paymentsource,
  RecentDepositsAndWithdrawals,
  TransactionAmountRange
} from "./../entities/paymentsource";
import { Financialchangetag } from "./../entities/financialchangetag";
import { Tag } from "./../entities/tag";
import { Financialchange } from "./../entities/financialchange";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Between,
  createQueryBuilder,
  getConnection,
  getRepository,
  Like,
  Repository
} from "typeorm";
import { FinancialChangeInputType } from "src/input-types/financial-change.input-type";
import { format } from "date-fns";
import { Appuser } from "src/entities/appuser";

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
    let where = "";

    if (expense !== undefined) {
      where = `expense = ${expense ? 1 : 0}`;
    }

    const { min, max } = await createQueryBuilder("financialchange")
      .select("MAX(amount) max, MIN(amount) min")
      .where(where)
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
    max?: number
  ): Promise<PaginatedFinancialChange> {
    const range = await this.getTransactionAmountRange(id);

    const filter = {
      appUserId: id,
      amount: Between(min || range.min, max || range.max),
      ...(description && { description: Like(`%${description}%`) })
    };

    const data = await this.financialChangeRepository.find({
      where: filter,
      order: { createdAt: "DESC" },
      skip,
      take,
      relations: ["financialchangetags"]
    });

    const count = await this.financialChangeRepository.count({
      where: filter
    });

    return new PaginatedFinancialChange(
      data.map((fc) => ({
        id: fc.id,
        transfer: fc.transfer,
        amount: fc.amount,
        description: fc.description,
        createdAt: format(fc.createdAt, "dd.MM.yyyy. HH:mm"),
        expense: fc.expense,
        paymentSourceId: fc.paymentSourceId,
        tagIds: fc.financialchangetags.map((fct) => fct.tagId)
      })),
      count
    );
  }

  async getFinancialChangeTags(id: number): Promise<Tag[]> {
    return await getRepository(Tag)
      .createQueryBuilder("t")
      .innerJoin(Financialchangetag, "fct", "fct.tagId = t.id")
      .where("fct.financialChangeId = :id", { id })
      .getMany();
  }

  async getPaymentSource(id: number): Promise<Paymentsource> {
    return (
      await this.financialChangeRepository.findOne({
        relations: ["paymentSource"],
        where: { id }
      })
    ).paymentSource;
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

    const userPaymentSourceIds: number[] = (
      await this.appUserRepository.findOne({
        where: { id: payload.appUserId },
        relations: ["paymentsources"]
      })
    ).paymentsources.map((ps) => ps.id);

    for (const id of userPaymentSourceIds) {
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
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        appUserId: payload.appUserId,
        paymentSourceId: id,
        amount: finalAmount
      });
    }
  }

  async create(payload: FinancialChangeInputType): Promise<void> {
    const financialChange = await this.financialChangeRepository.save({
      amount: payload.amount,
      description: payload.description,
      expense: payload.expense,
      paymentSourceId: payload.paymentSourceId,
      appUserId: payload.appUserId,
      createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss")
    });

    payload.tagIds.forEach(async (tagId) => {
      await this.financialChangeTagRepository.save({
        financialChangeId: financialChange.id,
        tagId
      });
    });

    const userPaymentSourceIds: number[] = (
      await this.appUserRepository.findOne({
        where: { id: payload.appUserId },
        relations: ["paymentsources"]
      })
    ).paymentsources.map((ps) => ps.id);

    for (const id of userPaymentSourceIds) {
      const current = await this.financialChangeHistoryRepository.findOne({
        where: { appUserId: payload.appUserId, paymentSourceId: id },
        order: { createdAt: "DESC" }
      });
      await this.financialChangeHistoryRepository.save({
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
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
    const res: GDailyChange[] = data[0];
    return res;
  }
}
