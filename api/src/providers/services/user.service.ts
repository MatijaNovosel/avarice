import { Appuser } from "./../../entities/appuser";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Appuser)
    private usersRepository: Repository<Appuser>
  ) {}

  findAll(): Promise<Appuser[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Appuser> {
    return this.usersRepository.findOne(id);
  }
}
