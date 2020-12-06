import { Financialchange } from "./../../entities/financialchange";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class FinancialChangeService {
  constructor(
    @InjectRepository(Financialchange)
    private financialChangeRepository: Repository<Financialchange>
  ) {}

  findAll(): Promise<Financialchange[]> {
    return this.financialChangeRepository.find();
  }

  findByUserId(userId: number): Promise<Financialchange[]> {
    return this.financialChangeRepository.find({ where: { id: userId } });
  }

  add(payload: Financialchange) {
    this.financialChangeRepository.save(payload);
  }
}
