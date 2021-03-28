import { FinancialHistoryService } from "./../../services/financial-history.service";
import { FinancialHistoryModule } from "./../repositories/financial-history.module";
import { Module } from "@nestjs/common";
import { FinancialHistoryResolver } from "../../resolvers/financial-history.resolver";

@Module({
  imports: [FinancialHistoryModule],
  providers: [FinancialHistoryResolver, FinancialHistoryService]
})
export class FinancialHistoryHttpModule {}
