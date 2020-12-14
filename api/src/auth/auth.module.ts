import { AuthResolver } from "./../resolvers/auth.resolver";
import { AuthService } from "src/services/auth.service";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "src/config/jwt-config.json";
import { JwtStrategy } from "./jwt.strategy";
import { AppUserModule } from "src/modules/repositories/app-user.module";

@Module({
  imports: [
    AppUserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: "60s" }
    })
  ],
  providers: [AuthService, LocalStrategy, AuthResolver, JwtStrategy]
})
export class AuthModule {}