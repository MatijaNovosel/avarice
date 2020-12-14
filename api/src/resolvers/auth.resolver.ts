import { GAppUser } from "./../entities/appuser";
import { AuthService } from "./../services/auth.service";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => GAppUser)
  async login(
    @Args({ name: "email" }) email: string,
    @Args({ name: "password" }) password: string
  ) {
    //
  }
}
