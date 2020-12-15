import { Financialchange } from "./financialchange";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appsetting } from "./appsetting";
import { Financialhistory } from "./financialhistory";

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

  @OneToMany(() => Appsetting, (appsetting) => appsetting.appUser)
  public appsettings?: Appsetting[];

  @OneToMany(
    () => Financialhistory,
    (financialhistory) => financialhistory.appUser
  )
  public financialhistories?: Financialhistory[];

  @OneToMany(
    () => Financialchange,
    (financialchange) => financialchange.appUser
  )
  public financialchanges?: Financialchange[];
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
  photoUrl?: string;

  @Field()
  password?: string;

  @Field()
  displayName?: string;
}
