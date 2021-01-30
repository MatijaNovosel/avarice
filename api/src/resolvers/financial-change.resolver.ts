import { PaginatedFinancialChange } from "./../models/item-collection";
import {
  FinancialChangeInputType,
  TransferInputType
} from "src/input-types/financial-change.input-type";
import { VoidScalar } from "src/scalars/void";
import { GFinancialChange } from "src/entities/financialchange";
import { Args, Float, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FinancialChangeService } from "src/services/financial-change.service";

@Resolver(() => GFinancialChange)
export class FinancialChangeResolver {
  constructor(private financialChangeService: FinancialChangeService) {}

  @Query(() => PaginatedFinancialChange, { name: "financialChanges" })
  async getAllByUserId(
    @Args("id", { type: () => Int }) id: number,
    @Args("skip", { type: () => Int, nullable: true }) skip: number,
    @Args("take", { type: () => Int, nullable: true }) take: number,
    @Args("description", { nullable: true }) description: string
  ) {
    return this.financialChangeService.findAllByUserId(id, skip, take, description);
  }

  @Query(() => Float, { name: "recentWithdrawals" })
  async getRecentWithdrawals(@Args("id", { type: () => Int }) id: number) {
    return this.financialChangeService.getRecentWithdrawalValues(id);
  }

  @Query(() => Float, { name: "recentGains" })
  async getRecentGains(@Args("id", { type: () => Int }) id: number) {
    return this.financialChangeService.getRecentGains(id);
  }

  @Mutation(() => VoidScalar, { nullable: true })
  async addFinancialChange(
    @Args("financialChange") financialChange: FinancialChangeInputType
  ) {
    await this.financialChangeService.create(financialChange);
  }

  @Mutation(() => VoidScalar, { nullable: true })
  async transfer(@Args("transfer") transfer: TransferInputType) {
    await this.financialChangeService.transfer(transfer);
  }
}
