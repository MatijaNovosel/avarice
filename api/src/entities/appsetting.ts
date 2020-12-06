import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appusersetting } from "./appusersetting";

@Entity("appsetting", { schema: "finapp" })
export class Appsetting {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public Id?: number;

  @Column("varchar", { name: "checkingGraphColor", nullable: true, length: 50 })
  public CheckingGraphColor?: string | null;

  @Column("varchar", { name: "gyroGraphColor", nullable: true, length: 50 })
  public GyroGraphColor?: string | null;

  @Column("varchar", { name: "pocketGraphColor", nullable: true, length: 50 })
  public PocketGraphColor?: string | null;

  @Column("varchar", { name: "totalGraphColor", nullable: true, length: 50 })
  public TotalGraphColor?: string | null;

  @Column("tinyint", { name: "gyroGraphVisible", nullable: true, width: 1 })
  public GyroGraphVisible?: boolean | null;

  @Column("tinyint", { name: "checkingGraphVisible", nullable: true, width: 1 })
  public CheckingGraphVisible?: boolean | null;

  @Column("tinyint", { name: "pocketGraphVisible", nullable: true, width: 1 })
  public PocketGraphVisible?: boolean | null;

  @Column("tinyint", { name: "totalGraphVisible", nullable: true, width: 1 })
  public TotalGraphVisible?: boolean | null;

  @OneToMany(
    () => Appusersetting,
    (Appusersetting) => Appusersetting.AppSetting
  )
  public Appusersettings?: Appusersetting[];
}
