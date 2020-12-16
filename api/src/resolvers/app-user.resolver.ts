import { AppUserInputType } from "./../input-types/app-user.input-type";
import { AppUserService } from "./../services/app-user.service";
import { GAppUser } from "./../entities/appuser";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver(() => GAppUser)
export class AppUserResolver {
  constructor(private appUserService: AppUserService) {}

  @Query(() => GAppUser, { name: "appUser" })
  async findById(@Args("id", { type: () => Int }) id: number) {
    return await this.appUserService.getUserById(id);
  }

  @Mutation(() => Int)
  async addUser(@Args("user") user: AppUserInputType) {
    await this.appUserService.create(user);
  }
}
