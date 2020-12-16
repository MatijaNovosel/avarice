import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class AuthGoogleLoginInputType {
  @Field({ nullable: true })
  uid?: string;

  @Field()
  email?: string;

  @Field({ nullable: true })
  photoUrl?: string;

  @Field()
  displayName?: string;
}
