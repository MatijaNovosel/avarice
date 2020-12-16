import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, Max, Min } from "class-validator";

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
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  @Min(4)
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
