import { AppSettingInputType } from "./../input-types/app-setting.input-type";
import { Appsetting } from "./../entities/appsetting";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AppSettingService {
  constructor(
    @InjectRepository(Appsetting)
    private repository: Repository<Appsetting>
  ) {}

  async findByUserId(id: number): Promise<Appsetting> {
    return await this.repository.findOne(id);
  }

  async update(appSetting: AppSettingInputType): Promise<void> {
    const appSettingRepo = await this.repository.findOne({
      where: { appUserId: appSetting.appUserId }
    });

    // Graph colors
    appSettingRepo.checkingGraphColor =
      appSetting.checkingGraphColor || appSettingRepo.checkingGraphColor;
    appSettingRepo.gyroGraphColor =
      appSetting.gyroGraphColor || appSettingRepo.gyroGraphColor;
    appSettingRepo.totalGraphColor =
      appSetting.totalGraphColor || appSettingRepo.totalGraphColor;
    appSettingRepo.pocketGraphColor =
      appSetting.pocketGraphColor || appSettingRepo.pocketGraphColor;

    // Graph visibility
    appSettingRepo.checkingGraphVisible =
      appSetting.checkingGraphVisible || appSettingRepo.checkingGraphVisible;
    appSettingRepo.gyroGraphVisible =
      appSetting.gyroGraphVisible || appSettingRepo.gyroGraphVisible;
    appSettingRepo.pocketGraphVisible =
      appSetting.pocketGraphVisible || appSettingRepo.pocketGraphVisible;
    appSettingRepo.totalGraphVisible =
      appSetting.totalGraphVisible || appSettingRepo.totalGraphVisible;

    await this.repository.update(appSettingRepo.id, appSettingRepo);
  }
}
