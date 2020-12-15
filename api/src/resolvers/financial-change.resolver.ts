import { FinancialChangeInputType } from "src/input-types/financial-change.input-type";
import { VoidScalar } from "src/scalars/void";
import { GFinancialChange } from "src/entities/financialchange";
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from "@nestjs/graphql";
import { FinancialChangeService } from "src/services/financial-change.service";

@Resolver(() => GFinancialChange)
export class FinancialChangeResolver {
  constructor(private financialChangeService: FinancialChangeService) {}

  @Query(() => [GFinancialChange], { name: "financialChanges" })
  async getAllByUserId(@Args("id", { type: () => Int }) id: number) {
    return this.financialChangeService.findAllByUserId(id);
  }

  @ResolveField()
  async tags(@Parent() financialChange: GFinancialChange) {
    const { id } = financialChange;
    return await this.financialChangeService.getFinancialChangeTags(id);
  }

  @ResolveField()
  async paymentSource(@Parent() financialChange: GFinancialChange) {
    const { id } = financialChange;
    return await this.financialChangeService.getPaymentSource(id);
  }

  @Mutation(() => VoidScalar, { nullable: true })
  async addFinancialChange(
    @Args("financialChange") financialChange: FinancialChangeInputType
  ) {
    await this.financialChangeService.create(financialChange);
  }
}
