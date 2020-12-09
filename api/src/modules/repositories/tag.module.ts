import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "src/entities/tag";

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  exports: [TypeOrmModule]
})
export class TagModule {}
