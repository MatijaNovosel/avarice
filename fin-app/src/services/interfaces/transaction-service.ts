import {
  CreateFinancialChangeItemDto,
  CreateTransferDto,
  FinancialChangeItem
} from "@/models/change-item";
import { FinancialHistory } from "@/models/history-item";
import { ItemCollection } from "@/models/item-collection";

export interface IChangeService {
  addChange(payload: CreateFinancialChangeItemDto): Promise<void>;
  getRecentWithdrawals(appUserId: number): Promise<number>;
  getRecentGains(appUserId: number): Promise<number>;
  transfer(payload: CreateTransferDto): Promise<void>;
  getChanges(
    appUserId: number,
    skip?: number,
    take?: number,
    description?: string
  ): Promise<ItemCollection<FinancialChangeItem>>;
  getHistory(
    appUserId: number,
    from: Date,
    to: Date
  ): Promise<FinancialHistory[]>;
}
