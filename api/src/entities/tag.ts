import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Financialchangetag } from "./financialchangetag";

@Entity("tag", { schema: "finapp" })
export class Tag {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public Id?: number;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  public Description?: string | null;

  @OneToMany(
    () => Financialchangetag,
    (Financialchangetag) => Financialchangetag.Tag
  )
  public Financialchangetags?: Financialchangetag[];
}
