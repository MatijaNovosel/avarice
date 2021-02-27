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
    return await this.repository.findOne({
      relations: ["locale"],
      where: { appUserId: id }
    });
  }

  async update(appSetting: AppSettingInputType): Promise<void> {
    const appSettingRepo = await this.repository.findOne({
      where: { appUserId: appSetting.appUserId }
    });

    appSettingRepo.darkMode = appSetting.darkMode || appSettingRepo.darkMode;
    appSettingRepo.localeId = appSetting.localeId || appSettingRepo.localeId;
    appSettingRepo.dateFormat = appSetting.dateFormat || appSettingRepo.dateFormat;
    appSettingRepo.preferredCurrency = appSetting.preferredCurrency || appSettingRepo.preferredCurrency;

    await this.repository.update(appSettingRepo.id, appSettingRepo);
  }
}
