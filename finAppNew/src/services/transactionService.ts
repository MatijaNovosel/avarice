import {
  CreateTransferDto,
  TransactionAmountRange,
  AddTransactionDto as NewTransaction
} from "@/models/transaction";
import { ITransactionService } from "@/interfaces/transactionService";
import {
  Client,
  AddTransactionDto,
  AddTransferDto,
  TransactionModel
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

  async transfer(payload: CreateTransferDto): Promise<void> {
    const client = new Client();
    await client.transaction_Transfer(
      new AddTransferDto({
        accountFromId: payload.accountFromId,
        accountToId: payload.accountToId,
        amount: payload.amount,
        userId: payload.userId,
        createdAt: new Date()
      })
    );
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
  ): Promise<TransactionModel[]> {
    const client = new Client();
    const data = client.transaction_Get(userId);
    return data;
  }
}
