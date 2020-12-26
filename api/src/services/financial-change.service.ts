import { PaginatedFinancialChange } from "./../models/item-collection";
import { Financialhistory } from "./../entities/financialhistory";
import { Paymentsource } from "./../entities/paymentsource";
import { Financialchangetag } from "./../entities/financialchangetag";
import { Tag } from "./../entities/tag";
import { Financialchange } from "./../entities/financialchange";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { FinancialChangeInputType } from "src/input-types/financial-change.input-type";
import { format } from "date-fns";
import { PaymentSourceEnum } from "src/constants/payment-source";
import { convert } from "exchange-rates-api";

@Injectable()
export class FinancialChangeService {
  constructor(
    @InjectRepository(Financialchange)
    private financialChangeRepository: Repository<Financialchange>,
    @InjectRepository(Financialchangetag)
    private financialChangeTagRepository: Repository<Financialchangetag>,
    @InjectRepository(Financialhistory)
    private financialChangeHistoryRepository: Repository<Financialhistory>
  ) {}

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

    const currentAmount: Financialhistory = await getRepository(
      Financialhistory
    )
      .createQueryBuilder("fh")
      .where("fh.appUserId = :id", { id: payload.appUserId })
      .orderBy("fh.createdAt", "DESC")
      .getOne();

    const euroConversion: number = await convert(
      currentAmount.euros,
      "EUR",
      "HRK",
      format(new Date(currentAmount.createdAt), "yyyy-MM-dd")
    );

    const historyEntry: Financialhistory = {
      checking:
        payload.paymentSourceId == PaymentSourceEnum.Checking
          ? parseFloat((currentAmount.checking - payload.amount).toFixed(2))
          : currentAmount.checking,
      euros: currentAmount.euros,
      gyro:
        payload.paymentSourceId == PaymentSourceEnum.Gyro
          ? parseFloat((currentAmount.gyro - payload.amount).toFixed(2))
          : currentAmount.gyro,
      pocket:
        payload.paymentSourceId == PaymentSourceEnum.Pocket
          ? parseFloat((currentAmount.pocket - payload.amount).toFixed(2))
          : currentAmount.pocket,
      createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      euroVal: euroConversion,
      appUserId: payload.appUserId
    };

    await this.financialChangeHistoryRepository.save(historyEntry);
  }
}
