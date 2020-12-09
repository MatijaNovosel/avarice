import { AppUserInputType } from "./../input-types/app-user.input-type";
import { Appuser } from "src/entities/appuser";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(Appuser)
    private repository: Repository<Appuser>
  ) {}

  async getUserById(id: number): Promise<Appuser> {
    return await this.repository.findOne(id);
  }

  async create(user: AppUserInputType): Promise<number> {
    const appUser: Appuser = {
      email: user.email,
      displayName: user.displayName
    };
    await this.repository.save(appUser);
    return appUser.id;
  }
}
