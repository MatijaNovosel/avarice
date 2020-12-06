import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Financialchange } from "./financialchange";

@Entity("paymentsource", { schema: "finapp" })
export class Paymentsource {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public Id?: number;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  public Description?: string | null;

  @OneToMany(
    () => Financialchange,
    (Financialchange) => Financialchange.PaymentSource
  )
  public Financialchanges?: Financialchange[];
}
