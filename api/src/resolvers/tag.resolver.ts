import { TagService } from "./../services/tag.service";
import { GTag } from "./../entities/tag";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";

@Resolver(() => GTag)
export class TagResolver {
  constructor(private tagService: TagService) {}

  @Query(() => [GTag], { name: "tags" })
  async getAll() {
    return this.tagService.findAll();
  }

  @Mutation(() => Int)
  async addTag(@Args({ name: "description" }) description: string) {
    return await this.tagService.add(description);
  }
}
