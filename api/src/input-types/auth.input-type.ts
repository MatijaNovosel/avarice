import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class AuthEmailLoginInputType {
  @Field()
  @IsEmail(
    {},
    {
      message: "Email format is invalid!"
    }
  )
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
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
  @MinLength(4)
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
