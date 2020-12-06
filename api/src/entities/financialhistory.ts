import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appuser } from "./appuser";

@Index("appUserId", ["AppUserId"], {})
@Entity("financialhistory", { schema: "finapp" })
export class Financialhistory {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public Id?: number;

  @Column("double", { name: "checking", nullable: true, precision: 22 })
  public Checking?: number | null;

  @Column("date", { name: "createdAt", nullable: true })
  public CreatedAt?: string | null;

  @Column("double", { name: "euros", nullable: true, precision: 22 })
  public Euros?: number | null;

  @Column("double", { name: "gyro", nullable: true, precision: 22 })
  public Gyro?: number | null;

  @Column("double", { name: "pocket", nullable: true, precision: 22 })
  public Pocket?: number | null;

  @Column("int", { name: "appUserId" })
  public AppUserId?: number;

  @ManyToOne(() => Appuser, (Appuser) => Appuser.Financialhistories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "appUserId", referencedColumnName: "Id" }])
  public AppUser?: Appuser;
}
