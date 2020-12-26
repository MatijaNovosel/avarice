import { Appuser } from "src/entities/appuser";
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
    private financialHistoryRepository: Repository<Financialhistory>,
    @InjectRepository(Appuser)
    private appUserRepository: Repository<Appuser>
  ) {}

  async findByUserId(
    appUserId: number,
    month?: number
  ): Promise<GFinancialHistory[]> {
    const userPaymentSourceIds: number[] = (
      await this.appUserRepository.findOne({
        where: { id: appUserId },
        relations: ["paymentsources"]
      })
    ).paymentsources.map((ps) => ps.id);

    const historyItems: GFinancialHistory[] = [];

    const res = await createQueryBuilder("financialhistory")
      .select("financialhistory.createdAt")
      .groupBy("financialhistory.createdAt")
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
          id: fh.id,
          amount: fh.amount
        });
      });

      historyItems.push({
        createdAt,
        paymentSources: userPaymentSources,
        total: 0
      });
    }

    return historyItems;
  }
}
