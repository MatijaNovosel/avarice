import { VoidScalar } from "./../scalars/void";
import { GAppUser } from "./../entities/appuser";
import { AuthService } from "./../services/auth.service";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import {
  AuthEmailLoginInputType,
  AuthGoogleLoginInputType
} from "src/input-types/auth.input-type";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => GAppUser)
  async login(@Args("input") input: AuthEmailLoginInputType) {
    const res = await this.authService.login({ ...input });
    console.log(res);
  }

  @Mutation(() => VoidScalar, { nullable: true })
  async googleLogin(@Args("input") input: AuthGoogleLoginInputType) {
    this.authService.googleLogin(input);
  }
}
