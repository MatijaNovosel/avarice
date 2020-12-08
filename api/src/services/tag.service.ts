import { Tag } from "../entities/tag";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private repository: Repository<Tag>
  ) {}

  async findAll(): Promise<Tag[]> {
    return await this.repository.find();
  }

  async add(description: string): Promise<number> {
    return (await this.repository.save({ description })).id;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
