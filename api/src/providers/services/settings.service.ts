import { Appsetting } from "./../../entities/appsetting";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Appsetting)
    private appSettingsRepository: Repository<Appsetting>
  ) {}

  findByUserId(userId: number) {
    return this.appSettingsRepository.findOne({ where: { appUserId: userId } });
  }

  async saveUserSettings(userId: number, payload: Appsetting) {
    this.appSettingsRepository.update(userId, payload);
  }
}
