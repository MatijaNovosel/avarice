import { TagModule } from "./tag.module";
import { TagService } from "../services/tag.service";
import { Module } from "@nestjs/common";
import { TagResolver } from "src/resolvers/tag.resolver";

@Module({
  imports: [TagModule],
  providers: [TagResolver, TagService]
})
export class TagHttpModule {}
