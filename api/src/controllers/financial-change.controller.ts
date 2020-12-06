import { Appuser } from '../entities/appuser';
import { Controller, Get } from "@nestjs/common";
import { FinancialChangeService } from 'src/providers/services/financial-change.service';

@Controller("financial-change")
export class FinancialChangeController {
  constructor(private financialChangeService: FinancialChangeService) {}
  @Get()
  findAll(): Promise<Appuser[]> {
    return this.financialChangeService.findAll();
  }
}
