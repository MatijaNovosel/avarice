import { Paymentsource } from "./../entities/paymentsource";
import { Financialchangetag } from "./../entities/financialchangetag";
import { Tag } from "./../entities/tag";
import { Financialchange } from "./../entities/financialchange";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { FinancialChangeInputType } from "src/input-types/financial-change.input-type";

@Injectable()
export class FinancialChangeService {
  constructor(
    @InjectRepository(Financialchange)
    private repository: Repository<Financialchange>
  ) {}

  async findAll(): Promise<Financialchange[]> {
    return await this.repository.find();
  }

  async getFinancialChangeTags(id: number): Promise<Tag[]> {
    /*

      SELECT t.id, t.description FROM tag AS t
      INNER JOIN financialchangetag AS fct ON fct.tagId = t.id
      WHERE fct.financialChangeId = {id}

    */
    return await getRepository(Tag)
      .createQueryBuilder("t")
      .innerJoin(Financialchangetag, "fct", "fct.tagId = t.id")
      .where("fct.financialChangeId = :id", { id })
      .getMany();
  }

  async getPaymentSource(id: number): Promise<Paymentsource> {
    return (
      await this.repository.findOne({
        relations: ["paymentSource"],
        where: { id }
      })
    ).paymentSource;
  }

  async create(payload: FinancialChangeInputType): Promise<void> {
    await this.repository.save(payload);
  }
}
