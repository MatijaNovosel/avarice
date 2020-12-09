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

@Index("appUserId", ["appUserId"], {})
@Entity("appsetting", { schema: "finapp" })
export class Appsetting {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @Column("varchar", { name: "checkingGraphColor", nullable: true, length: 50 })
  public checkingGraphColor?: string | null;

  @Column("varchar", { name: "gyroGraphColor", nullable: true, length: 50 })
  public gyroGraphColor?: string | null;

  @Column("varchar", { name: "pocketGraphColor", nullable: true, length: 50 })
  public pocketGraphColor?: string | null;

  @Column("varchar", { name: "totalGraphColor", nullable: true, length: 50 })
  public totalGraphColor?: string | null;

  @Column("tinyint", { name: "gyroGraphVisible", nullable: true, width: 1 })
  public gyroGraphVisible?: boolean | null;

  @Column("tinyint", { name: "checkingGraphVisible", nullable: true, width: 1 })
  public checkingGraphVisible?: boolean | null;

  @Column("tinyint", { name: "pocketGraphVisible", nullable: true, width: 1 })
  public pocketGraphVisible?: boolean | null;

  @Column("tinyint", { name: "totalGraphVisible", nullable: true, width: 1 })
  public totalGraphVisible?: boolean | null;

  @Column("int", { name: "appUserId", nullable: true })
  public appUserId?: number | null;

  @ManyToOne(() => Appuser, (appuser) => appuser.appsettings, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{ name: "appUserId", referencedColumnName: "id" }])
  public appUser?: Appuser;
}

@ObjectType()
export class GAppsetting {
  @Field(() => Int)
  public id?: number;

  @Field()
  public checkingGraphColor?: string;

  @Field()
  public gyroGraphColor?: string;

  @Field()
  public pocketGraphColor?: string;

  @Field()
  public totalGraphColor?: string;

  @Field()
  public gyroGraphVisible?: boolean;

  @Field()
  public checkingGraphVisible?: boolean;

  @Field()
  public pocketGraphVisible?: boolean;

  @Field()
  public totalGraphVisible?: boolean;

  @Field(() => Int)
  public appUserId?: number;
}
