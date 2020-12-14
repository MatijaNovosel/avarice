import { Financialhistory } from "./../../entities/financialhistory";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Financialhistory])],
  exports: [TypeOrmModule]
})
export class FinancialHistoryModule {}
