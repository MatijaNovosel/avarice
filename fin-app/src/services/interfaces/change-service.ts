import { CategoryEnum } from "@/constants/category-enum";
import { ChangeItem } from "@/models/change-item";
import { HistoryItem, HistoryItemDto } from "@/models/history-item";

interface Filter {
  category: CategoryEnum[];
}

export interface IChangeService {
  addChange(payload: ChangeItem): Promise<void>;
  addHistory(payload: HistoryItem): Promise<void>;
  getChanges(filterOptions?: Filter): Promise<ChangeItem[]>;
  getHistory(): Promise<HistoryItemDto[]>;
  getCurrentAmount(): Promise<HistoryItemDto>;
}
