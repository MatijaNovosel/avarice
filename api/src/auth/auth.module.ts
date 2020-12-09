import { AuthService } from "src/services/auth.service";
import { AppUserModule } from "./../modules/repositories/app-user.module";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";

@Module({
  imports: [AppUserModule, PassportModule],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
