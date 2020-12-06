import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Appuser } from "./appuser";
import { Appsetting } from "./appsetting";

@Entity("appusersetting", { schema: "finapp" })
export class Appusersetting {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public id?: number;

  @ManyToOne(() => Appuser, (appuser) => appuser.appusersettings, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "appUserId", referencedColumnName: "id" }])
  public appUser?: Appuser;

  @ManyToOne(() => Appsetting, (appsetting) => appsetting.appusersettings, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "appSettingId", referencedColumnName: "id" }])
  public appSetting?: Appsetting;
}
