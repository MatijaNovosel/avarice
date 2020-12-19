import { FinancialHistoryService } from "./../services/financial-history.service";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { GFinancialHistory } from "src/entities/financialhistory";

@Resolver(() => GFinancialHistory)
export class FinancialHistoryResolver {
  constructor(private financialHistoryService: FinancialHistoryService) {}

  @Query(() => [GFinancialHistory], { name: "financialHistory" })
  async getAll(@Args("id") id: number) {
    return this.financialHistoryService.findByUserId(id);
  }
}
