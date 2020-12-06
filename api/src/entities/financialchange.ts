import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Paymentsource } from "./paymentsource";
import { Financialchangetag } from "./financialchangetag";

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
