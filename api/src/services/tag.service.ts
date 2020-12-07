import { Tag } from "../entities/tag";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) {}

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async add(description: string): Promise<number> {
    return await (await this.tagRepository.save({ description })).id;
  }

  async delete(id: number): Promise<void> {
    await this.tagRepository.delete(id);
  }
}
