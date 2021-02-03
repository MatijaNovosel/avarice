import {
  GDailyChange,
  RecentDepositsAndWithdrawals,
  TransactionAmountRange
} from "./../entities/paymentsource";
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
    @Args("description", { nullable: true }) description: string,
    @Args("min", { type: () => Float, nullable: true }) min: number,
    @Args("max", { type: () => Float, nullable: true }) max: number
  ) {
    return this.financialChangeService.findAllByUserId(
      id,
      skip,
      take,
      description,
      min,
      max
    );
  }

  @Query(() => RecentDepositsAndWithdrawals, {
    name: "recentDepositsAndWithdrawals"
  })
  async getRecentDepositsAndWithdrawals(
    @Args("appUserId", { type: () => Int }) appUserId: number
  ) {
    return this.financialChangeService.getRecentDepositsAndWithdrawals(
      appUserId
    );
  }

  @Query(() => TransactionAmountRange, { name: "transactionAmountRange" })
  async getTransactionAmountRange(
    @Args("appUserId", { type: () => Int }) appUserId: number,
    @Args("expense", { nullable: true }) expense: boolean
  ) {
    return this.financialChangeService.getTransactionAmountRange(
      appUserId,
      expense
    );
  }

  @Query(() => [GDailyChange], { name: "dailyChanges" })
  async getTagPercentages(@Args({ name: "appUserId" }) appUserId: number) {
    return this.financialChangeService.getDailyChanges(appUserId);
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
