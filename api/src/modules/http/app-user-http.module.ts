import { FinancialHistoryModule } from "./../repositories/financial-history.module";
import { AppUserService } from "./../../services/app-user.service";
import { AppUserResolver } from "./../../resolvers/app-user.resolver";
import { AppUserModule } from "./../repositories/app-user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [AppUserModule, FinancialHistoryModule],
  providers: [AppUserResolver, AppUserService]
})
export class AppUserHttpModule {}
