import {
  Financialhistory,
  GFinancialHistory,
  GUserPaymentSource
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
    month?: number
  ): Promise<GFinancialHistory[]> {
    const historyItems: GFinancialHistory[] = [];

    const res = await createQueryBuilder("financialhistory")
      .select("financialhistory.createdAt")
      .groupBy("financialhistory.createdAt")
      .orderBy("financialHistory.createdAt", "DESC")
      .getRawMany();

    for (const entry of res) {
      const createdAt = entry.createdAt;
      const userPaymentSources: GUserPaymentSource[] = [];
      const data: Financialhistory[] = await this.financialHistoryRepository.find(
        {
          where: { appUserId, createdAt }
        }
      );

      data.forEach((fh) => {
        userPaymentSources.push({
          id: fh.paymentSourceId,
          amount: fh.amount
        });
      });

      historyItems.push({
        createdAt: format(createdAt, "dd.MM.yyyy. HH:mm"),
        paymentSources: userPaymentSources,
        total: 0
      });
    }

    return historyItems;
  }
}
