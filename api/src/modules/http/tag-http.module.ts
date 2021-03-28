import { TagModule } from "../repositories/tag.module";
import { TagService } from "../../services/tag.service";
import { Module } from "@nestjs/common";
import { TagResolver } from "../../resolvers/tag.resolver";

@Module({
  imports: [TagModule],
  providers: [TagResolver, TagService]
})
export class TagHttpModule {}
