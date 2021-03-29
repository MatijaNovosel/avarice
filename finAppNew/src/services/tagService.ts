import { Tag } from "./../models/tag";
import { ITagService } from "./../interfaces/tagService";
import { formatGqlRequest } from "@/helpers";
import axios from "axios";

export class TagService implements ITagService {
  async getTags(appUserId: number): Promise<Tag[]> {
    const query = formatGqlRequest({
      type: "query",
      name: "tags",
      responseParams: ["id", "description"]
    });

    const {
      data: {
        data: { tags }
      }
    } = await axios.post("", {
      query
    });

    return tags.map((x: Tag) => ({
      id: x.id,
      description: x.description
    }));
  }
}
