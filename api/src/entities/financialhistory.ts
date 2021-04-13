import { Field, Int, ObjectType, Float } from "@nestjs/graphql";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Appuser } from "./appuser";
import { Paymentsource } from "./paymentsource";

@Index("appUserId", ["appUserId"], {})
@Index("paymentSourceId", ["paymentSourceId"], {})
@Entity("financialhistory", { schema: "finapp" })
export class Financialhistory {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("int", { name: "paymentSourceId", nullable: true })
  public paymentSourceId?: number | null;

  @Column("double", { name: "amount", precision: 22, default: () => "'0'" })
  public amount?: number;

  @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
  public createdAt?: Date;

  @Column("int", { name: "appUserId", nullable: true })
  public appUserId?: number | null;

  @ManyToOne(
    () => Paymentsource,
    (paymentsource) => paymentsource.financialhistories,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "paymentSourceId", referencedColumnName: "id" }])
  public paymentSource?: Paymentsource;

  @ManyToOne(() => Appuser, (appuser) => appuser.financialhistories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{ name: "appUserId", referencedColumnName: "id" }])
  public appUser?: Appuser;
}

@ObjectType()
export class GUserPaymentSource {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  amount: number;
}

@ObjectType()
export class GFinancialHistory {
  @Field()
  createdAt: string;

  @Field(() => [GUserPaymentSource])
  paymentSources: GUserPaymentSource[];

  @Field(() => Float)
  total: number;
}

@ObjectType()
export class GUserPaymentSourceDetailed {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  amount: number;

  @Field()
  description: string;

  @Field()
  icon: string;
}

@ObjectType()
export class GFinancialHistoryCurrentAmount {
  @Field()
  createdAt: string;

  @Field(() => [GUserPaymentSourceDetailed])
  paymentSources: GUserPaymentSourceDetailed[];

  @Field(() => Float)
  total: number;
}

@ObjectType()
export class GLatestDate {
  @Field()
  latestDate: string;
}
