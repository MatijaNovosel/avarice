import { Module } from "@nestjs/common";
import { AppSettingResolver } from "../../resolvers/app-setting.resolver";
import { AppSettingService } from "../../services/app-setting.service";
import { AppSettingModule } from "../../modules/repositories/app-setting.module";

@Module({
  imports: [AppSettingModule],
  providers: [AppSettingResolver, AppSettingService]
})
export class AppSettingHttpModule {}
