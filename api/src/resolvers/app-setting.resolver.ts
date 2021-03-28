import { AppSettingService } from "../services/app-setting.service";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GAppsetting } from "../entities/appsetting";
import { VoidScalar } from "../scalars/void";
import { AppSettingInputType } from "../input-types/app-setting.input-type";
import { ValidationPipe } from "@nestjs/common";

@Resolver(() => GAppsetting)
export class AppSettingResolver {
  constructor(private appSettingService: AppSettingService) {}

  @Query(() => GAppsetting, { name: "appSettings" })
  async findByUserId(@Args("userId", { type: () => Int }) userId: number) {
    return await this.appSettingService.findByUserId(userId);
  }

  @Mutation(() => VoidScalar, { nullable: true })
  async updateUserAppSetting(
    @Args("appSetting", new ValidationPipe()) appSetting: AppSettingInputType
  ) {
    await this.appSettingService.update(appSetting);
  }
}
