import { TagEnum } from "@/constants/tag-enum";
import { ChangeItem } from "@/models/change-item";
import { HistoryItem, HistoryItemDto } from "@/models/history-item";

interface Filter {
  tag: TagEnum[];
}

export interface IChangeService {
  addChange(payload: ChangeItem): Promise<void>;
  addHistory(payload: HistoryItem): Promise<void>;
  getChanges(filterOptions?: Filter): Promise<ChangeItem[]>;
  getHistory(): Promise<HistoryItemDto[]>;
  getCurrentAmount(): Promise<HistoryItemDto>;
  funkcija(): Promise<void>;
}
