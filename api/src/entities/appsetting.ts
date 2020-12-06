import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appusersetting } from "./appusersetting";

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

  @OneToMany(
    () => Appusersetting,
    (appusersetting) => appusersetting.appSetting
  )
  public appusersettings?: Appusersetting[];
}
