import { TagService } from "./../services/tag.service";
import { Module } from "@nestjs/common";
import { TagResolver } from "src/resolvers/tag.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "src/entities/tag";

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagResolver, TagService]
})
export class GTagModule {}
