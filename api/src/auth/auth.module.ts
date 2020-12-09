import { AuthResolver } from "./../resolvers/auth.resolver";
import { AppUserHttpModule } from "./../modules/http/app-user-http.module";
import { AuthService } from "src/services/auth.service";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "src/config/jwt-config.json";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    AppUserHttpModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: "60s" }
    })
  ],
  providers: [AuthService, LocalStrategy, AuthResolver, JwtStrategy]
})
export class AuthModule {}
