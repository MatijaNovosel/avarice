import {
  CreateFinancialChangeItemDto,
  CreateTransferDto,
  FinancialChangeItem,
  TransactionAmountRange
} from "@/models/change-item";
import { FinancialHistory } from "@/models/history-item";
import { ItemCollection } from "@/models/item-collection";

export interface ITransactionService {
  addChange(payload: CreateFinancialChangeItemDto): Promise<void>;
  getRecentWithdrawals(appUserId: number): Promise<number>;
  getRecentGains(appUserId: number): Promise<number>;
  getTransactionAmountRange(
    appUserId: number,
    expense?: boolean | null
  ): Promise<TransactionAmountRange>;
  transfer(payload: CreateTransferDto): Promise<void>;
  getChanges(
    appUserId: number,
    skip?: number | null,
    take?: number | null,
    description?: string,
    min?: number | null,
    max?: number | null
  ): Promise<ItemCollection<FinancialChangeItem>>;
  getHistory(
    appUserId: number,
    from: Date,
    to: Date
  ): Promise<FinancialHistory[]>;
}
