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
    private appUserRepository: Repository<Appuser>
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
    return appUser.id;
  }
}
