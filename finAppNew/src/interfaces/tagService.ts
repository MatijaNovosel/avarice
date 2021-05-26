import { TagModel } from "@/apiClient/client";

export interface ITagService {
  getTags(userId: string): Promise<TagModel[]>;
}
