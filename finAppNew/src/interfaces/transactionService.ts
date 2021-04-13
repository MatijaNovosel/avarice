import { DailyChange, LatestDate } from "@/models/change-item";
import {
  CreateFinancialChangeItemDto,
  CreateTransferDto,
  FinancialChangeItem,
  RecentDepositsAndWithdrawals,
  TransactionAmountRange
} from "@/models/change-item";
import { FinancialHistory } from "@/models/history-item";
import { ItemCollection } from "@/models/item-collection";

export interface ITransactionService {
  addChange(payload: CreateFinancialChangeItemDto): Promise<void>;
  getRecentDepositsAndWithdrawals(
    appUserId: number
  ): Promise<RecentDepositsAndWithdrawals>;
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
    max?: number | null,
    tags?: number[] | null,
    transactionType?: number | null,
    account?: number | null
  ): Promise<ItemCollection<FinancialChangeItem>>;
  getHistory(
    appUserId: number,
    from: Date,
    to: Date
  ): Promise<FinancialHistory[]>;
  getTotal(
    appUserId: number,
    from?: Date | null,
    to?: Date | null
  ): Promise<FinancialHistory[]>;
  getDailyChanges(appUserId: number): Promise<DailyChange[]>;
  getLatestDate(appUserId: number): Promise<LatestDate>;
}
