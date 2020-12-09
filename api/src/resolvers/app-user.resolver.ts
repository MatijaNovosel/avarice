import { AppUserService } from "./../services/app-user.service";
import { GAppUser } from "./../entities/appuser";
import { Args, Int, Query, Resolver } from "@nestjs/graphql";

@Resolver(() => GAppUser)
export class AppUserResolver {
  constructor(private appUserService: AppUserService) {}

  @Query(() => GAppUser, { name: "appUser" })
  async findById(@Args("id", { type: () => Int }) id: number) {
    return await this.appUserService.getUserById(id);
  }
}
