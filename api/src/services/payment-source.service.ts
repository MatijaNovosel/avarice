import { GPaymentSource } from "./../entities/paymentsource";
import { Paymentsource } from "../entities/paymentsource";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PaymentSourceService {
  constructor(
    @InjectRepository(Paymentsource)
    private paymentSourceRepository: Repository<Paymentsource>
  ) {}

  async findAllByUserId(appUserId: number): Promise<GPaymentSource[]> {
    return (
      await this.paymentSourceRepository.find({ where: { appUserId } })
    ).map(
      (x) =>
        ({
          appUserId,
          currency: x.currency,
          description: x.description,
          icon: x.icon,
          id: x.id
        } as GPaymentSource)
    );
  }

  async create(): Promise<void> {
    //
  }
}
