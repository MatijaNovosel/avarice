import { Financialchange } from "src/entities/financialchange";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Financialchange])],
  exports: [TypeOrmModule]
})
export class FinancialChangeModule {}
