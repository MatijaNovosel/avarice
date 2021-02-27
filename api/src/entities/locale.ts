import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appsetting } from "./appsetting";

@Entity("locale", { schema: "finapp" })
export class Locale {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("varchar", { name: "text", nullable: true, length: 50 })
  public text?: string | null;

  @OneToMany(() => Appsetting, (appsetting) => appsetting.locale)
  public appsettings?: Appsetting[];
}

@ObjectType()
export class GLocale {
  @Field()
  id?: number | null;

  @Field()
  text?: string | null;
}
