import { AppSettingService } from "src/services/app-setting.service";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GAppsetting } from "src/entities/appsetting";
import { VoidScalar } from "src/scalars/void";
import { AppSettingInputType } from "src/input-types/app-setting.input-type";

@Resolver(() => GAppsetting)
export class AppSettingResolver {
  constructor(private appSettingService: AppSettingService) {}

  @Query(() => GAppsetting, { name: "appSettings" })
  async findByUserId(@Args("userId", { type: () => Int }) userId: number) {
    return await this.appSettingService.findByUserId(userId);
  }

  @Mutation(() => VoidScalar, { nullable: true })
  async updateUserAppSetting(
    @Args("appSetting") appSetting: AppSettingInputType
  ) {
    await this.appSettingService.update(appSetting);
  }
}
