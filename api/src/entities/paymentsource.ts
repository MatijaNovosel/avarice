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
