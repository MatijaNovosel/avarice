import { InputType, Field, Float } from "@nestjs/graphql";
import { PaymentSourceInputType } from "./payment-source.input-type";
import { TagInputType } from "./tag.input-type";

@InputType()
export class FinancialChangeInputType {
  @Field(() => Float)
  amount: number;

  @Field()
  description?: string;

  @Field()
  expense?: boolean;

  @Field(() => PaymentSourceInputType)
  paymentSource?: PaymentSourceInputType;

  @Field(() => [TagInputType])
  tags?: TagInputType[];
}
