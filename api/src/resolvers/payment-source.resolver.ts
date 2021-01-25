import { VoidScalar } from "./../scalars/void";
import {
  GLatestAccountValue,
  GPaymentSource,
  GTagPercentage
} from "./../entities/paymentsource";
import { PaymentSourceService } from "./../services/payment-source.service";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver(() => GPaymentSource)
export class PaymentSourceResolver {
  constructor(private paymentSourceService: PaymentSourceService) {}

  @Query(() => [GPaymentSource], { name: "paymentSources" })
  async getAll(@Args({ name: "id" }) id: number) {
    return this.paymentSourceService.findAllByUserId(id);
  }

  @Query(() => [GLatestAccountValue], { name: "latestValues" })
  async getLatestValues(@Args({ name: "id" }) id: number) {
    return this.paymentSourceService.getLatestValues(id);
  }

  @Query(() => [GTagPercentage], { name: "tagPercentages" })
  async getTagPercentages(@Args({ name: "appUserId" }) appUserId: number) {
    return this.paymentSourceService.getTagPercentages(appUserId);
  }

  @Mutation(() => Int)
  async create(@Args({ name: "description" }) description: string) {
    return await this.paymentSourceService.create();
  }
}
