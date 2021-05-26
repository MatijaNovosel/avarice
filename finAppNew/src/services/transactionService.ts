import { ItemCollection } from "@/models/item-collection";
import {
  CreateFinancialChangeItemDto,
  FinancialChangeItem,
  CreateTransferDto,
  TransactionAmountRange,
  LatestDate
} from "@/models/change-item";
import { AccountHistoryRecord } from "@/models/history-item";
import { ITransactionService } from "@/interfaces/transactionService";

export class TransactionService implements ITransactionService {
  addTransaction(payload: CreateFinancialChangeItemDto): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getTransactionAmountRange(
    userId: string,
    expense?: boolean | null
  ): Promise<TransactionAmountRange> {
    throw new Error("Method not implemented.");
  }

  transfer(payload: CreateTransferDto): Promise<void> {
    throw new Error("Method not implemented.");
  }

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
  ): Promise<ItemCollection<FinancialChangeItem>> {
    throw new Error("Method not implemented.");
  }

  getHistoryForAccount(
    userId: string,
    from: Date,
    to: Date,
    accountId: number
  ): Promise<AccountHistoryRecord[]> {
    throw new Error("Method not implemented.");
  }
}
