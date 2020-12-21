import { AuthRegisterInputType } from "./../input-types/auth.input-type";
import { VoidScalar } from "./../scalars/void";
import { AuthService } from "./../services/auth.service";
import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
import {
  AuthEmailLoginInputType,
  AuthGoogleLoginInputType
} from "src/input-types/auth.input-type";
import { AccessToken } from "src/entities/auth";
import { ValidationPipe } from "@nestjs/common";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AccessToken)
  async login(
    @Args("input", new ValidationPipe()) input: AuthEmailLoginInputType
  ) {
    const res = await this.authService.login(input.email, input.password);
    return res;
  }

  @Mutation(() => AccessToken)
  async googleLogin(@Args("input") input: AuthGoogleLoginInputType) {
    this.authService.googleLogin(input);
  }

  @Mutation(() => Int)
  async register(
    @Args("input", new ValidationPipe()) input: AuthRegisterInputType
  ) {
    return await this.authService.register(input.email, input.password);
  }
}
