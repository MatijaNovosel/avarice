import { AppUserModule } from "./../repositories/app-user.module";
import { FinancialHistoryService } from "./../../services/financial-history.service";
import { FinancialHistoryModule } from "./../repositories/financial-history.module";
import { Module } from "@nestjs/common";
import { FinancialHistoryResolver } from "src/resolvers/financial-history.resolver";

@Module({
  imports: [FinancialHistoryModule, AppUserModule],
  providers: [FinancialHistoryResolver, FinancialHistoryService]
})
export class FinancialHistoryHttpModule {}
