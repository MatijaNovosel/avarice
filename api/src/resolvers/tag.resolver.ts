import { VoidScalar } from "./../scalars/void";
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
  async create(@Args({ name: "description" }) description: string) {
    return await this.tagService.add(description);
  }

  @Mutation(() => VoidScalar, { nullable: true })
  async delete(@Args({ name: "id", type: () => Int }) id: number) {
    await this.tagService.delete(id);
  }
}
