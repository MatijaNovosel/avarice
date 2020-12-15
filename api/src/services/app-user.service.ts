import { Financialhistory } from "./../entities/financialhistory";
import { AppUserInputType } from "./../input-types/app-user.input-type";
import { Appuser } from "src/entities/appuser";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { format } from "date-fns";

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(Appuser)
    private appUserRepository: Repository<Appuser>,
    @InjectRepository(Financialhistory)
    private financialHistoryRepository: Repository<Financialhistory>
  ) {}

  async getUserById(id: number): Promise<Appuser> {
    return await this.appUserRepository.findOne(id);
  }

  async create(user: AppUserInputType): Promise<number> {
    const appUser: Appuser = {
      email: user.email,
      displayName: user.displayName
    };

    await this.appUserRepository.save(appUser);
    await this.financialHistoryRepository.save({
      checking: 0,
      pocket: 0,
      euros: 0,
      gyro: 0,
      createdAt: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
      appUserId: appUser.id
    });

    return appUser.id;
  }
}
