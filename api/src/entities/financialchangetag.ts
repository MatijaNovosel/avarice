import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Financialchange } from "./financialchange";
import { Tag } from "./tag";

@Index("financialChangeId", ["FinancialChangeId"], {})
@Index("tagId", ["TagId"], {})
@Entity("financialchangetag", { schema: "finapp" })
export class Financialchangetag {
  @Column("int", { name: "financialChangeId" })
  public FinancialChangeId?: number;

  @Column("int", { name: "tagId" })
  public TagId?: number;

  @ManyToOne(
    () => Financialchange,
    (Financialchange) => Financialchange.Financialchangetags,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "financialChangeId", referencedColumnName: "Id" }])
  public FinancialChange?: Financialchange;

  @ManyToOne(() => Tag, (Tag) => Tag.Financialchangetags, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tagId", referencedColumnName: "Id" }])
  public Tag?: Tag;
}
