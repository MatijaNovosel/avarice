import {
  CreateFinancialChangeItemDto,
  FinancialChangeItem
} from "@/models/change-item";
import { FinancialHistoryItem } from "@/models/history-item";
import { ItemCollection } from "@/models/item-collection";

export interface IChangeService {
  addChange(payload: CreateFinancialChangeItemDto): Promise<void>;
  getChanges(appUserId: number): Promise<ItemCollection<FinancialChangeItem>>;
  getHistory(appUserId: number): Promise<FinancialHistoryItem[]>;
}
