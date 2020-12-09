import { Module } from "@nestjs/common";
import { AppSettingResolver } from "src/resolvers/app-setting.resolver";
import { AppSettingService } from "src/services/app-setting.service";
import { AppSettingModule } from "./app-setting.module";

@Module({
  imports: [AppSettingModule],
  providers: [AppSettingResolver, AppSettingService]
})
export class AppSettingHttpModule {}
