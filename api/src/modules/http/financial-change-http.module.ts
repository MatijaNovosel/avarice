import { AppUserModule } from "./../repositories/app-user.module";
import { FinancialHistoryModule } from "./../repositories/financial-history.module";
import { FinancialChangeModule } from "../../modules/repositories/financial-change.module";
import { FinancialChangeResolver } from "../../resolvers/financial-change.resolver";
import { Module } from "@nestjs/common";
import { FinancialChangeService } from "../../services/financial-change.service";
import { FinancialChangeTagModule } from "../../modules/repositories/financial-change-tag.module";

@Module({
  imports: [
    FinancialChangeModule,
    FinancialChangeTagModule,
    FinancialHistoryModule,
    AppUserModule
  ],
  providers: [FinancialChangeResolver, FinancialChangeService]
})
export class FinancialChangeHttpModule {}
