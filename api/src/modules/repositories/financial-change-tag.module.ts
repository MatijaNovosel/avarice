import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Financialchangetag } from "../../entities/financialchangetag";

@Module({
  imports: [TypeOrmModule.forFeature([Financialchangetag])],
  exports: [TypeOrmModule]
})
export class FinancialChangeTagModule {}
