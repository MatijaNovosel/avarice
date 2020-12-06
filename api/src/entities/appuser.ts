import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appusersetting } from "./appusersetting";
import { Financialhistory } from "./financialhistory";

@Entity("appuser", { schema: "finapp" })
export class Appuser {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  public Id?: number;

  @Column("varchar", { name: "uid", nullable: true, length: 255 })
  public Uid?: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  public Email?: string | null;

  @Column("varchar", { name: "photoURL", nullable: true, length: 255 })
  public PhotoUrl?: string | null;

  @Column("varchar", { name: "displayName", nullable: true, length: 255 })
  public DisplayName?: string | null;

  @OneToMany(() => Appusersetting, (Appusersetting) => Appusersetting.AppUser)
  public Appusersettings?: Appusersetting[];

  @OneToMany(
    () => Financialhistory,
    (Financialhistory) => Financialhistory.AppUser
  )
  public Financialhistories?: Financialhistory[];
}
