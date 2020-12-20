import { Financialhistory } from "./../entities/financialhistory";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { convert } from "exchange-rates-api";
import { format } from "date-fns";

@Injectable()
export class FinancialHistoryService {
  constructor(
    @InjectRepository(Financialhistory)
    private financialHistoryRepository: Repository<Financialhistory>
  ) {}

  async findByUserId(id: number): Promise<Financialhistory[]> {
    const data = await this.financialHistoryRepository.find({
      where: { appUserId: id }
    });
    for (const financialHistory of data) {
      const euroConversion: number = await convert(
        financialHistory.euros,
        "EUR",
        "HRK",
        format(new Date(financialHistory.createdAt), "yyyy-MM-dd")
      );
      financialHistory.total =
        financialHistory.checking +
        financialHistory.gyro +
        financialHistory.pocket +
        euroConversion;
    }
    return data;
  }
}
