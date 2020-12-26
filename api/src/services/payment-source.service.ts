import { GPaymentSource } from './../entities/paymentsource';
import { PaginatedFinancialChange } from "../models/item-collection";
import { Paymentsource } from "../entities/paymentsource";
import { Financialchange } from "../entities/financialchange";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PaymentSourceService {
  constructor(
    @InjectRepository(Financialchange)
    private paymentSourceRepository: Repository<Paymentsource>
  ) {}

  async findAllByUserId(appUserId: number): Promise<GPaymentSource> {
    //
  }

  async create(): Promise<void> {
    //
  }
}
