import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Financialchange } from "./financialchange";
import { Tag } from "./tag";

@Entity("financialchangetag", { schema: "finapp" })
export class Financialchangetag {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @ManyToOne(
    () => Financialchange,
    (financialchange) => financialchange.financialchangetags,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "financialChangeId", referencedColumnName: "id" }])
  public financialChange?: Financialchange;

  @ManyToOne(() => Tag, (tag) => tag.financialchangetags, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tagId", referencedColumnName: "id" }])
  public tag?: Tag;
}
