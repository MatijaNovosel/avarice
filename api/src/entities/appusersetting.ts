import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Appuser } from "./appuser";
import { Appsetting } from "./appsetting";

@Index("appUserId", ["AppUserId"], {})
@Index("appSettingId", ["AppSettingId"], {})
@Entity("appusersetting", { schema: "finapp" })
export class Appusersetting {
  @Column("int", { name: "appUserId" })
  public AppUserId?: number;

  @Column("int", { name: "appSettingId" })
  public AppSettingId?: number;

  @ManyToOne(() => Appuser, (Appuser) => Appuser.Appusersettings, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "appUserId", referencedColumnName: "Id" }])
  public AppUser?: Appuser;

  @ManyToOne(() => Appsetting, (Appsetting) => Appsetting.Appusersettings, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "appSettingId", referencedColumnName: "Id" }])
  public AppSetting?: Appsetting;
}
