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
  PageableCollectionOfTransactionModel
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
        tagIds: payload.tagIds
      })
    );
  }

  getTransactionAmountRange(
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
        createdAt: new Date()
      })
    );
  }

  getTransactions(
    skip?: number,
    take?: number
  ): Promise<PageableCollectionOfTransactionModel> {
    const client = new Client();
    const data = client.transaction_Get(skip, take);
    return data;
  }
}
