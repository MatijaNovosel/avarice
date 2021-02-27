import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Appuser } from "./appuser";
import { GLocale, Locale } from "./locale";

@Index("appsetting_ibfk_2", ["localeId"], {})
@Index("appUserId", ["appUserId"], {})
@Entity("appsetting", { schema: "finapp" })
export class Appsetting {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("tinyint", { name: "darkMode", nullable: true, width: 1 })
  public darkMode?: boolean | null;

  @Column("int", { name: "localeId", nullable: true })
  public localeId?: number | null;

  @Column("varchar", {
    name: "preferredCurrency",
    length: 50,
    default: () => "'HRK'"
  })
  public preferredCurrency?: string;

  @Column("varchar", {
    name: "dateFormat",
    length: 50,
    default: () => "'dd.MM.yyyy. HH:mm'"
  })
  public dateFormat?: string;

  @Column("int", { name: "appUserId", nullable: true })
  public appUserId?: number | null;

  @ManyToOne(() => Appuser, (appuser) => appuser.appsettings, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{ name: "appUserId", referencedColumnName: "id" }])
  public appUser?: Appuser;

  @ManyToOne(() => Locale, (locale) => locale.appsettings, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{ name: "localeId", referencedColumnName: "id" }])
  public locale?: Locale;
}

@ObjectType()
export class GAppsetting {
  @Field()
  public darkMode?: boolean;

  @Field()
  public locale?: GLocale;

  @Field()
  public preferredCurrency?: string;

  @Field()
  public dateFormat?: string;
}
