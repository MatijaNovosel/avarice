import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Financialchangetag } from "./financialchangetag";

@Entity("tag", { schema: "finapp" })
export class Tag {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  public description?: string | null;

  @OneToMany(
    () => Financialchangetag,
    (financialchangetag) => financialchangetag.tag
  )
  public financialchangetags?: Financialchangetag[];
}

@ObjectType()
export class GTag {
  @Field(() => Int)
  id?: number;

  @Field({ description: "Tag description", nullable: true })
  description?: string;
}
