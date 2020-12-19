import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Appuser } from "./appuser";

@Index("appUserId", ["appUserId"], {})
@Entity("financialhistory", { schema: "finapp" })
export class Financialhistory {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("double", { name: "checking", nullable: true, precision: 22 })
  public checking?: number | null;

  @Column("datetime", { name: "createdAt" })
  public createdAt?: string;

  @Column("double", { name: "euros", nullable: true, precision: 22 })
  public euros?: number | null;

  @Column("double", { name: "gyro", nullable: true, precision: 22 })
  public gyro?: number | null;

  @Column("double", { name: "pocket", nullable: true, precision: 22 })
  public pocket?: number | null;

  @Column("int", { name: "appUserId" })
  public appUserId?: number;

  @ManyToOne(() => Appuser, (appuser) => appuser.financialhistories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{ name: "appUserId", referencedColumnName: "id" }])
  public appUser?: Appuser;
}

@ObjectType()
export class GFinancialHistory {
  @Field(() => Int)
  id: number;

  @Field()
  createdAt: string;

  @Field()
  checking: number;

  @Field()
  gyro: number;

  @Field()
  pocket: number;

  @Field()
  euros: number;

  @Field()
  appUserId: number;
}
