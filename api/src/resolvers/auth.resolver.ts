import { GAppUser } from "./../entities/appuser";
import { AuthService } from "./../services/auth.service";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => GAppUser)
  @UseGuards(LocalAuthGuard)
  async login(
    @Args({ name: "email" }) email: string,
    @Args({ name: "password" }) password: string
  ) {
    //
  }
}
