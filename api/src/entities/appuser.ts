import { Financialchange } from "./financialchange";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appsetting } from "./appsetting";
import { Financialhistory } from "./financialhistory";
import { Paymentsource } from "./paymentsource";

@Entity("appuser", { schema: "finapp" })
export class Appuser {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("varchar", { name: "uid", nullable: true, length: 255 })
  public uid?: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  public email?: string | null;

  @Column("varchar", { name: "photoURL", nullable: true, length: 255 })
  public photoUrl?: string | null;

  @Column("varchar", { name: "displayName", nullable: true, length: 255 })
  public displayName?: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 255 })
  public password?: string | null;

  @Column("tinyint", { name: "emailConfirmed", default: () => "'0'" })
  public emailConfirmed?: number;

  @OneToMany(() => Appsetting, (appsetting) => appsetting.appUser)
  public appsettings?: Appsetting[];

  @OneToMany(
    () => Financialchange,
    (financialchange) => financialchange.appUser
  )
  public financialchanges?: Financialchange[];

  @OneToMany(
    () => Financialhistory,
    (financialhistory) => financialhistory.appUser
  )
  public financialhistories?: Financialhistory[];

  @OneToMany(() => Paymentsource, (paymentsource) => paymentsource.appUser)
  public paymentsources?: Paymentsource[];
}

@ObjectType()
export class GAppUser {
  @Field(() => Int)
  id?: number;

  @Field()
  uid?: string;

  @Field()
  email?: string;

  @Field()
  emailConfirmed?: boolean;

  @Field()
  photoUrl?: string;

  @Field()
  password?: string;

  @Field()
  displayName?: string;
}
