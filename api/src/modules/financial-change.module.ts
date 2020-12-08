import { Financialchangetag } from './../entities/financialchangetag';
import { TagService } from "./../services/tag.service";
import { FinancialChangeResolver } from "./../resolvers/financial-change.resolver";
import { Financialchange } from "./../entities/financialchange";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FinancialChangeService } from "src/services/financial-change.service";

@Module({
  imports: [TypeOrmModule.forFeature([Financialchange, Financialchangetag])],
  providers: [FinancialChangeResolver, FinancialChangeService]
})
export class FinancialChangeModule {}
