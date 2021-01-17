import { PaginatedFinancialChange } from "./../models/item-collection";
import { Financialhistory } from "./../entities/financialhistory";
import { Paymentsource } from "./../entities/paymentsource";
import { Financialchangetag } from "./../entities/financialchangetag";
import { Tag } from "./../entities/tag";
import { Financialchange } from "./../entities/financialchange";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createQueryBuilder, getRepository, Repository } from "typeorm";
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

  async getRecentWithdrawalValues(appUserId: number) {
    const res = await createQueryBuilder("financialchange")
      .select("ROUND(SUM(amount), 2) total")
      .where(
        `expense = 1 AND createdAt BETWEEN NOW() - INTERVAL 30 DAY AND NOW() AND appUserId = ${appUserId}`
      )
      .getRawOne();
    return res.total;
  }

  async getRecentGains(appUserId: number) {
    const res = await createQueryBuilder("financialchange")
      .select("ROUND(SUM(amount), 2) total")
      .where(
        `expense = 0 AND createdAt BETWEEN NOW() - INTERVAL 30 DAY AND NOW() AND appUserId = ${appUserId}`
      )
      .getRawOne();
    return res.total;
  }

  async findAllByUserId(
    id: number,
    skip?: number,
    take?: number
  ): Promise<PaginatedFinancialChange> {
    const data = await this.financialChangeRepository.find({
      where: { appUserId: id },
      order: { createdAt: "DESC" },
      skip,
      take,
      relations: ["financialchangetags"]
    });
    const count = await this.financialChangeRepository.count({
      where: { appUserId: id }
    });
    return new PaginatedFinancialChange(
      data.map((fc) => ({
        id: fc.id,
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
    /*

      SELECT t.id, t.description FROM tag AS t
      INNER JOIN financialchangetag AS fct ON fct.tagId = t.id
      WHERE fct.financialChangeId = {id}

    */
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
}
