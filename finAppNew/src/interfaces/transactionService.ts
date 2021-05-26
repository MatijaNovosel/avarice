import { LatestDate } from "@/models/change-item";
import {
  CreateFinancialChangeItemDto,
  CreateTransferDto,
  FinancialChangeItem,
  TransactionAmountRange
} from "@/models/change-item";
import { AccountHistoryRecord } from "@/models/history-item";
import { ItemCollection } from "@/models/item-collection";

export interface ITransactionService {
  addTransaction(payload: CreateFinancialChangeItemDto): Promise<void>;
  getTransactionAmountRange(
    userId: string,
    expense?: boolean | null
  ): Promise<TransactionAmountRange>;
  transfer(payload: CreateTransferDto): Promise<void>;
  getTransactions(
    userId: string,
    skip?: number | null,
    take?: number | null,
    description?: string,
    min?: number | null,
    max?: number | null,
    tags?: number[] | null,
    transactionType?: number | null,
    account?: number | null,
    showTransfers?: boolean | null
  ): Promise<ItemCollection<FinancialChangeItem>>;
  getHistoryForAccount(
    userId: string,
    from: Date,
    to: Date,
    accountId: number
  ): Promise<AccountHistoryRecord[]>;
}
