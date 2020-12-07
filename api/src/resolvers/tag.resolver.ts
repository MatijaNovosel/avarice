// import { TagService } from "./../providers/services/tag.service";
import { GTag } from "./../entities/tag";
import { Query, Resolver } from "@nestjs/graphql";

@Resolver(() => GTag)
export class TagResolver {
  @Query(() => [GTag], { name: "tags" })
  async getAll() {
    return [{ description: "Bruh", id: 1 }];
  }
}
