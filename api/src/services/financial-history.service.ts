import { Financialhistory } from "./../entities/financialhistory";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";
import { format } from "date-fns";

@Injectable()
export class FinancialHistoryService {
  constructor(
    @InjectRepository(Financialhistory)
    private financialHistoryRepository: Repository<Financialhistory>
  ) {}

  async findByUserId(
    id: number,
    month: number = 12,
    year: number = 2020
  ): Promise<Financialhistory[]> {
    const data = await this.financialHistoryRepository.find({
      where: {
        appUserId: id,
        createdAt: MoreThanOrEqual(`${year}-${month}-00 00:00:00`)
      }
    });
    return data.map((fh) => {
      fh.total = fh.checking + fh.gyro + fh.pocket + fh.euroVal;
      fh.createdAt = format(new Date(fh.createdAt), "dd.MM.yyyy. HH:mm:ss");
      return fh;
    });
  }
}
