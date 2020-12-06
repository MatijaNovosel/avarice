import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appusersetting } from "./appusersetting";
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

  @OneToMany(() => Appusersetting, (appusersetting) => appusersetting.appUser)
  public appusersettings?: Appusersetting[];

  @OneToMany(
    () => Financialhistory,
    (financialhistory) => financialhistory.appUser
  )
  public financialhistories?: Financialhistory[];
}
