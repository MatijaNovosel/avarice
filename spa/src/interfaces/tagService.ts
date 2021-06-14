import { TagModel } from "@/apiClient/client";

export interface ITagService {
  getTags(): Promise<TagModel[]>;
}
