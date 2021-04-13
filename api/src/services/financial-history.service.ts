import {
  Financialhistory,
  GFinancialHistory,
  GFinancialHistoryCurrentAmount,
  GLatestDate,
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
  async getLatestDate(appUserId: number): Promise<GLatestDate> {
    const { maxDate } = await createQueryBuilder("financialhistory")
      .select("MAX(createdAt)", "maxDate")
      .where({ appUserId })
      .getRawOne();
    return { latestDate: format(maxDate, "dd.MM.yyyy. HH:mm:ss") };
  }

  async findByUserId(
    appUserId: number,
    from?: string,
    to?: string
  ): Promise<GFinancialHistory[]> {
    const historyItems: GFinancialHistory[] = [];

    let filterString = "";
    if (from && to) {
      filterString = `financialhistory.createdAt >= '${from}' AND financialhistory.createdAt <= '${to}'`;
    }

    const res = await createQueryBuilder("financialhistory")
      .select("financialhistory.createdAt")
      .where(filterString)
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
        createdAt: format(createdAt, "dd.MM.yyyy. HH:mm:ss"),
        paymentSources: userPaymentSources,
        total: parseFloat(total.toFixed(2))
      });
    }

    return historyItems;
  }

  async getCurrentAmountByUserId(
    appUserId: number
  ): Promise<GFinancialHistoryCurrentAmount> {
    const res = await createQueryBuilder("financialhistory")
      .select("MAX(financialhistory.createdAt)", "createdAt")
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
      createdAt: format(createdAt, "dd.MM.yyyy. HH:mm:ss"),
      paymentSources: userPaymentSources,
      total
    };
  }
}
