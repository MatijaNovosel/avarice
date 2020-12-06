import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Paymentsource } from "./paymentsource";
import { Financialchangetag } from "./financialchangetag";

@Index("paymentSourceId", ["PaymentSourceId"], {})
@Entity("financialchange", { schema: "finapp" })
export class Financialchange {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public Id?: number;

  @Column("double", { name: "amount", nullable: true, precision: 22 })
  public Amount?: number | null;

  @Column("date", { name: "createdAt", nullable: true })
  public CreatedAt?: string | null;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  public Description?: string | null;

  @Column("tinyint", { name: "expense", nullable: true, width: 1 })
  public Expense?: boolean | null;

  @Column("int", { name: "paymentSourceId", nullable: true })
  public PaymentSourceId?: number | null;

  @ManyToOne(
    () => Paymentsource,
    (Paymentsource) => Paymentsource.Financialchanges,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "paymentSourceId", referencedColumnName: "Id" }])
  public PaymentSource?: Paymentsource;

  @OneToMany(
    () => Financialchangetag,
    (Financialchangetag) => Financialchangetag.FinancialChange
  )
  public Financialchangetags?: Financialchangetag[];
}
