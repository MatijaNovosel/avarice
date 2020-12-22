import { Financialhistory } from "./../entities/financialhistory";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
    return data.map((fh) => {
      fh.total = fh.checking + fh.gyro + fh.pocket + fh.euroVal;
      fh.createdAt = format(new Date(fh.createdAt), "dd.MM.yyyy. HH:mm:ss");
      return fh;
    });
  }
}
