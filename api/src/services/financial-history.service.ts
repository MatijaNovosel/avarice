import { Appuser } from "src/entities/appuser";
import {
  Financialhistory,
  GFinancialHistory,
  GFinancialHistoryRecord,
  GUserPaymentSource
} from "./../entities/financialhistory";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

    const userPaymentSources: GUserPaymentSource[] = [];

    userPaymentSourceIds.forEach(async (id) => {
      const data: Financialhistory[] = await this.financialHistoryRepository.find(
        {
          where: { appUserId, paymentSourceId: id },
          order: { createdAt: "DESC" }
        }
      );
      console.log({
        id,
        financialHistoryRecords: data.map((fh) => ({
          amount: fh.amount,
          createdAt: format(fh.createdAt, "dd.MM.yyyy. HH:mm")
        }))
      });
      userPaymentSources.push({
        id,
        financialHistoryRecords: data.map((fh) => ({
          amount: fh.amount,
          createdAt: format(fh.createdAt, "dd.MM.yyyy. HH:mm")
        }))
      });
    });

    const historyItems: GFinancialHistory[] = [];

    return historyItems;
  }
}
