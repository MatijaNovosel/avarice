import {
  CreateFinancialChangeItemDto, FinancialChangeItem
} from "@/models/change-item";
import { FinancialHistoryItem } from "@/models/history-item";

export interface IChangeService {
  addChange(payload: CreateFinancialChangeItemDto): Promise<void>;
  getChanges(appUserId: number): Promise<FinancialChangeItem[]>;
  getHistory(appUserId: number): Promise<FinancialHistoryItem[]>;
}
