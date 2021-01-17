import {
  Financialhistory,
  GFinancialHistory,
  GFinancialHistoryCurrentAmount,
  GUserPaymentSource,
  GUserPaymentSourceDetailed
} from "./../entities/financialhistory";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createQueryBuilder, Repository } from "typeorm";
import { format } from "date-fns";

@Injectable()
export class FinancialHistoryService {
  constructor(
    @InjectRepository(Financialhistory)
    private financialHistoryRepository: Repository<Financialhistory>
  ) {}
  async findByUserId(
    appUserId: number,
    from?: string,
    to?: string
  ): Promise<GFinancialHistory[]> {
    const historyItems: GFinancialHistory[] = [];

    const res = await createQueryBuilder("financialhistory")
      .select("financialhistory.createdAt")
      .where(
        `financialhistory.createdAt >= '${from}' AND financialhistory.createdAt <= '${to}'`
      )
      .groupBy("financialhistory.createdAt")
      .orderBy("financialHistory.createdAt", "ASC")
      .getRawMany();

    for (const entry of res) {
      let total = 0;
      const createdAt = entry.createdAt;
      const userPaymentSources: GUserPaymentSource[] = [];
      const data: Financialhistory[] = await this.financialHistoryRepository.find(
        {
          where: { appUserId, createdAt }
        }
      );

      for (const fh of data) {
        userPaymentSources.push({
          id: fh.paymentSourceId,
          amount: fh.amount
        });
        total += fh.amount;
      }

      historyItems.push({
        createdAt: format(createdAt, "dd.MM.yyyy. HH:mm"),
        paymentSources: userPaymentSources,
        total
      });
    }

    return historyItems;
  }

  async getCurrentAmountByUserId(
    appUserId: number
  ): Promise<GFinancialHistoryCurrentAmount> {
    const res = await createQueryBuilder("financialhistory")
      .select("financialhistory.createdAt")
      .groupBy("financialhistory.createdAt")
      .orderBy("financialHistory.createdAt", "DESC")
      .getRawOne();

    let total = 0;
    const createdAt = res.createdAt;
    const userPaymentSources: GUserPaymentSourceDetailed[] = [];

    const data: Financialhistory[] = await this.financialHistoryRepository.find(
      {
        where: { appUserId, createdAt },
        relations: ["paymentSource"]
      }
    );

    for (const fh of data) {
      userPaymentSources.push({
        id: fh.paymentSourceId,
        amount: fh.amount,
        description: fh.paymentSource.description,
        icon: fh.paymentSource.icon
      });
      total += fh.amount;
    }

    return {
      createdAt: format(createdAt, "dd.MM.yyyy. HH:mm"),
      paymentSources: userPaymentSources,
      total
    };
  }
}
