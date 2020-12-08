import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Financialchange } from "./financialchange";

@Entity("paymentsource", { schema: "finapp" })
export class Paymentsource {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  public description?: string | null;

  @OneToMany(
    () => Financialchange,
    (financialchange) => financialchange.paymentSource
  )
  public financialchanges?: Financialchange[];
}

@ObjectType()
export class GPaymentSource {
  @Field(() => Int)
  id?: number;

  @Field({ description: "Payment source description", nullable: true })
  description?: string;
}
