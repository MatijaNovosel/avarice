import { Appuser } from './appuser';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { GPaymentSource, Paymentsource } from "./paymentsource";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { GTag, Tag } from "./tag";
import { Financialchangetag } from "./financialchangetag";

@Index("paymentSourceId", ["paymentSourceId"], {})
@Entity("financialchange", { schema: "finapp" })
export class Financialchange {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("double", { name: "amount", nullable: true, precision: 22 })
  public amount?: number | null;

  @Column("date", { name: "createdAt", nullable: true })
  public createdAt?: string | null;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  public description?: string | null;

  @Column("tinyint", { name: "expense", nullable: true, width: 1 })
  public expense?: boolean | null;

  @Column("int", { name: "paymentSourceId", nullable: true })
  public paymentSourceId?: number | null;

  @ManyToOne(
    () => Paymentsource,
    (paymentsource) => paymentsource.financialchanges,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "paymentSourceId", referencedColumnName: "id" }])
  public paymentSource?: Paymentsource;

  @ManyToOne(
    () => Appuser,
    (appuser) => appuser.financialchanges,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "appUserId", referencedColumnName: "id" }])
  public appUser?: Appuser;

  @OneToMany(
    () => Financialchangetag,
    (financialchangetag) => financialchangetag.financialChange
  )
  public financialchangetags?: Financialchangetag[];
}

@ObjectType()
export class GFinancialChange {
  @Field(() => Int)
  id?: number;

  @Field(() => Float)
  amount?: number;

  @Field()
  createdAt?: string;

  @Field()
  description?: string;

  @Field()
  expense?: boolean;

  @Field(() => GPaymentSource)
  paymentSource?: GPaymentSource;

  @Field(() => [GTag])
  tags?: GTag[];
}
