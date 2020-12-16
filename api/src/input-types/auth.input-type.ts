import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class AuthEmailLoginInputType {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class AuthRegisterInputType {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class AuthGoogleLoginInputType {
  @Field()
  uid: string;

  @Field()
  email: string;

  @Field()
  photoUrl: string;

  @Field()
  displayName: string;
}
