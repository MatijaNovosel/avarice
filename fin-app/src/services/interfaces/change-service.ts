import {
  CreateFinancialChangeItemDto,
  FinancialChangeItem
} from "@/models/change-item";
import { FinancialHistory } from "@/models/history-item";
import { ItemCollection } from "@/models/item-collection";

export interface IChangeService {
  addChange(payload: CreateFinancialChangeItemDto): Promise<void>;
  getChanges(
    appUserId: number,
    skip?: number,
    take?: number
  ): Promise<ItemCollection<FinancialChangeItem>>;
  getHistory(
    appUserId: number,
    from: Date,
    to: Date
  ): Promise<FinancialHistory[]>;
}
