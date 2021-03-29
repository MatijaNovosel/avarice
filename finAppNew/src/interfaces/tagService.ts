import { Tag } from "@/models/tag";

export interface ITagService {
  getTags(appUserId: number): Promise<Tag[]>;
}
