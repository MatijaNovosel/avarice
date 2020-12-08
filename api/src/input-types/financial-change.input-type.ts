import { InputType, Field } from "@nestjs/graphql";
import { GPaymentSource } from "src/entities/paymentsource";
import { GTag } from "src/entities/tag";

@InputType()
export class FinancialChangeInputType {
  @Field()
  amount: number;

  @Field()
  createdAt?: string;

  @Field()
  expense?: boolean;

  @Field()
  paymentSource?: GPaymentSource;

  @Field()
  tags?: GTag[];
}
