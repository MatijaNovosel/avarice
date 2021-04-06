import {
  GLatestAccountValue,
  GPaymentSource,
  GTagPercentage
} from "./../entities/paymentsource";
import { Paymentsource } from "../entities/paymentsource";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createQueryBuilder, getConnection, Repository } from "typeorm";
import { format } from "date-fns";

@Injectable()
export class PaymentSourceService {
  constructor(
    @InjectRepository(Paymentsource)
    private paymentSourceRepository: Repository<Paymentsource>
  ) {}

  async getLatestValues(appUserId: number): Promise<GLatestAccountValue[]> {
    const { maxDate } = await createQueryBuilder("financialhistory")
      .select("MAX(createdAt)", "maxDate")
      .getRawOne();

    const res: GLatestAccountValue[] = await createQueryBuilder(
      "financialhistory"
    )
      .select("amount")
      .addSelect("description")
      .addSelect("ps.id", "id")
      .addSelect("icon")
      .addSelect("currency")
      .innerJoin("paymentsource", "ps", "ps.id = paymentSourceId")
      .where(`createdAt IN ('${format(maxDate, "yyyy-MM-dd HH:mm:ss")}')`)
      .getRawMany();

    return res;
  }

  async findAllByUserId(appUserId: number): Promise<GPaymentSource[]> {
    return (
      await this.paymentSourceRepository.find({ where: { appUserId } })
    ).map<GPaymentSource>((account) => ({
      appUserId,
      currency: account.currency,
      description: account.description,
      icon: account.icon,
      id: account.id
    }));
  }

  async getTagPercentages(appUserId: number): Promise<GTagPercentage[]> {
    const data = await getConnection().query("CALL getTagPercentages(?)", [
      appUserId
    ]);
    const res: GTagPercentage[] = data[0];
    return res;
  }

  async create(): Promise<void> {
    //
  }
}
