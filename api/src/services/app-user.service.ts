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
}
