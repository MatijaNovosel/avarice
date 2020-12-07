import { Tag } from "./../../entities/tag";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) {}

  findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }
}
