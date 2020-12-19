import { Financialhistory } from "./../entities/financialhistory";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class FinancialHistoryService {
  constructor(
    @InjectRepository(Financialhistory)
    private financialHistoryRepository: Repository<Financialhistory>
  ) {}

  async findByUserId(id: number): Promise<Financialhistory[]> {
    return await this.financialHistoryRepository.find({
      where: { appUserId: id }
    });
  }
}
