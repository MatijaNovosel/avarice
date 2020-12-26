import { GPaymentSource } from "./../entities/paymentsource";
import { PaymentSourceService } from "./../services/payment-source.service";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver(() => GPaymentSource)
export class PaymentSourceResolver {
  constructor(private paymentSourceService: PaymentSourceService) {}

  @Query(() => [GPaymentSource], { name: "tags" })
  async getAll(@Args({ name: "id" }) id: number) {
    return this.paymentSourceService.findAllByUserId(id);
  }

  @Mutation(() => Int)
  async create(@Args({ name: "description" }) description: string) {
    return await this.paymentSourceService.create();
  }
}
