import { AuthResolver } from "./../resolvers/auth.resolver";
import { AuthService } from "../services/auth.service";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { secret } from "../config/jwt-config";
import { JwtStrategy } from "./jwt.strategy";
import { AppUserModule } from "../modules/repositories/app-user.module";

@Module({
  imports: [
    AppUserModule,
    PassportModule,
    JwtModule.register({
      secret,
      signOptions: { expiresIn: "60s" }
    })
  ],
  providers: [AuthService, LocalStrategy, AuthResolver, JwtStrategy]
})
export class AuthModule {}
