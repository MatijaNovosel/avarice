// import { TagService } from "./../providers/services/tag.service";
import { Module } from "@nestjs/common";
import { TagResolver } from "src/resolvers/tag.resolver";

@Module({
  providers: [TagResolver]
})
export class GTagModule {}
