import { PaginatedFinancialChange } from "./../models/item-collection";
import { FinancialChangeInputType } from "src/input-types/financial-change.input-type";
import { VoidScalar } from "src/scalars/void";
import { GFinancialChange } from "src/entities/financialchange";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FinancialChangeService } from "src/services/financial-change.service";

@Resolver(() => GFinancialChange)
export class FinancialChangeResolver {
  constructor(private financialChangeService: FinancialChangeService) {}

  @Query(() => PaginatedFinancialChange, { name: "financialChanges" })
  async getAllByUserId(
    @Args("id", { type: () => Int }) id: number,
    @Args("skip", { type: () => Int, nullable: true }) skip: number,
    @Args("take", { type: () => Int, nullable: true }) take: number
  ) {
    return this.financialChangeService.findAllByUserId(id, skip, take);
  }

  @Mutation(() => VoidScalar, { nullable: true })
  async addFinancialChange(
    @Args("financialChange") financialChange: FinancialChangeInputType
  ) {
    await this.financialChangeService.create(financialChange);
  }
}
