import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Financialchange } from "./financialchange";
import { Tag } from "./tag";

@Index("financialChangeId", ["financialChangeId"], {})
@Index("tagId", ["tagId"], {})
@Entity("financialchangetag", { schema: "finapp" })
export class Financialchangetag {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("int", { name: "financialChangeId" })
  public financialChangeId?: number;

  @Column("int", { name: "tagId" })
  public tagId?: number;

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
