import { Appuser } from "./appuser";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Paymentsource } from "./paymentsource";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Financialchangetag } from "./financialchangetag";

@Index("appUserId", ["appUserId"], {})
@Index("paymentSourceId", ["paymentSourceId"], {})
@Entity("financialchange", { schema: "finapp" })
export class Financialchange {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("double", { name: "amount", nullable: true, precision: 22 })
  public amount?: number | null;

  @Column("datetime", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
  public createdAt?: Date;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  public description?: string | null;

  @Column("tinyint", { name: "expense", nullable: true, width: 1 })
  public expense?: boolean | null;

  @Column("tinyint", { name: "transfer", nullable: true, width: 1 })
  public transfer?: boolean | null;

  @Column("int", { name: "paymentSourceId", nullable: true })
  public paymentSourceId?: number | null;

  @Column("int", { name: "appUserId", nullable: true })
  public appUserId?: number | null;

  @ManyToOne(() => Appuser, (appuser) => appuser.financialchanges, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{ name: "appUserId", referencedColumnName: "id" }])
  public appUser?: Appuser;

  @ManyToOne(
    () => Paymentsource,
    (paymentsource) => paymentsource.financialchanges,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "paymentSourceId", referencedColumnName: "id" }])
  public paymentSource?: Paymentsource;

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

  @Field()
  transfer?: boolean;

  @Field(() => Int)
  paymentSourceId?: number;

  @Field(() => [Int])
  tagIds?: number[];
}
