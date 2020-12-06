import { Financialchange } from '../entities/financialchange';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FinancialChangeService } from 'src/providers/services/financial-change.service';
import { FinancialChangeController } from 'src/controllers/financial-change.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Financialchange])],
  providers: [FinancialChangeService],
  controllers: [FinancialChangeController]
})
export class FinancialChangeModule {}
