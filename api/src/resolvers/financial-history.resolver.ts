import { FinancialHistoryService } from "./../services/financial-history.service";
import { Args, Query, Resolver } from "@nestjs/graphql";
import {
  GFinancialHistory,
  GFinancialHistoryCurrentAmount
} from "src/entities/financialhistory";

@Resolver(() => GFinancialHistory)
export class FinancialHistoryResolver {
  constructor(private financialHistoryService: FinancialHistoryService) {}

  @Query(() => [GFinancialHistory], { name: "financialHistory" })
  async getAll(
    @Args("id") id: number,
    @Args("from", { nullable: true }) from: string,
    @Args("to", { nullable: true }) to: string
  ) {
    return this.financialHistoryService.findByUserId(id, from, to);
  }

  @Query(() => GFinancialHistoryCurrentAmount, {
    name: "financialHistoryCurrentAmount"
  })
  async getCurrentAmountByUserId(@Args("id") id: number) {
    return this.financialHistoryService.getCurrentAmountByUserId(id);
  }
}
