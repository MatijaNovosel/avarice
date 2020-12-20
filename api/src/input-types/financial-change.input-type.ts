import { InputType, Field, Float, Int } from "@nestjs/graphql";

@InputType()
export class FinancialChangeInputType {
  @Field(() => Int)
  appUserId: number;

  @Field(() => Float)
  amount: number;

  @Field()
  description?: string;

  @Field()
  expense?: boolean;

  @Field(() => Int)
  paymentSourceId: number;

  @Field(() => [Int])
  tagIds?: number[];
}
