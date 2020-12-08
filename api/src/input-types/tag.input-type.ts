import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class TagInputType {
  @Field(() => Int)
  id: number;
}
