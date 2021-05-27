import { ItemCollection } from "@/models/item-collection";
import {
  Transaction,
  CreateTransferDto,
  TransactionAmountRange,
  AddTransactionDto as NewTransaction
} from "@/models/transaction";
import { AccountHistoryRecord } from "@/models/history-item";
import { ITransactionService } from "@/interfaces/transactionService";
import {
  Client,
  AddTransactionDto,
  HistoryTotalModel
} from "@/apiClient/client";

export class TransactionService implements ITransactionService {
  async addTransaction(payload: NewTransaction): Promise<void> {
    const client = new Client();
    await client.transaction_Add(
      new AddTransactionDto({
        accountId: payload.accountId,
        amount: payload.amount,
        createdAt: new Date(),
        expense: payload.expense,
        description: payload.description as string,
        tagIds: payload.tagIds,
        userId: payload.userId
      })
    );
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
  ): Promise<ItemCollection<Transaction>> {
    throw new Error("Method not implemented.");
  }
}
