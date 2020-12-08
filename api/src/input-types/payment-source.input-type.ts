import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class PaymentSourceInputType {
  @Field(() => Int)
  id: number;
}
