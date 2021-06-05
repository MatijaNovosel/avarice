import { ITagService } from "@/interfaces/tagService";
import { Client, TagModel } from "@/apiClient/client";

export class TagService implements ITagService {
  async getTags(userId: string): Promise<TagModel[]> {
    const client = new Client();
    const tags = await client.tag_Get(userId);
    return tags;
  }
}
