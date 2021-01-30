import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Appuser } from "./appuser";
import { Financialchange } from "./financialchange";
import { Financialhistory } from "./financialhistory";

@Index("appUserId", ["appUserId"], {})
@Entity("paymentsource", { schema: "finapp" })
export class Paymentsource {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("varchar", { name: "currency", length: 50, default: () => "'HRK'" })
  public currency?: string;

  @Column("varchar", { name: "icon", length: 50, default: () => "'eye'" })
  public icon?: string;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  public description?: string | null;

  @Column("int", { name: "appUserId", nullable: true })
  public appUserId?: number | null;

  @OneToMany(
    () => Financialchange,
    (financialchange) => financialchange.paymentSource
  )
  public financialchanges?: Financialchange[];

  @OneToMany(
    () => Financialhistory,
    (financialhistory) => financialhistory.paymentSource
  )
  public financialhistories?: Financialhistory[];

  @ManyToOne(() => Appuser, (appuser) => appuser.paymentsources, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{ name: "appUserId", referencedColumnName: "id" }])
  public appUser?: Appuser;
}

@ObjectType()
export class GLatestAccountValue {
  @Field()
  amount?: number;

  @Field()
  description?: string;

  @Field()
  currency?: string;

  @Field()
  icon?: string;
}

@ObjectType()
export class GPaymentSource {
  @Field(() => Int)
  id?: number;

  @Field()
  description?: string;

  @Field()
  currency?: string;

  @Field()
  icon?: string;

  @Field(() => Int)
  appUserId?: number;
}

@ObjectType()
export class GTagPercentage {
  @Field(() => Int)
  id?: number;

  @Field()
  description?: string;

  @Field()
  percentage?: number;
}

@ObjectType()
export class TransactionAmountRange {
  @Field(() => Float)
  min?: number;
  
  @Field(() => Float)
  max?: number;
}

@ObjectType()
export class RecentDepositsAndWithdrawals {
  @Field(() => Float)
  withdrawals?: number;

  @Field(() => Float)
  deposits?: number;
}