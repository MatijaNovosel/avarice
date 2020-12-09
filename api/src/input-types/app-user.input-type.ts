import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class AppUserInputType {
  @Field({ nullable: true })
  uid?: string;

  @Field()
  email?: string;

  @Field({ nullable: true })
  photoUrl?: string;

  @Field()
  displayName?: string;
}
