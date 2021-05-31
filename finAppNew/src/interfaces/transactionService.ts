import {
  AddTransactionDto,
  CreateTransferDto,
  TransactionAmountRange
} from "@/models/transaction";
import { TransactionModel } from "@/apiClient/client";

export interface ITransactionService {
  addTransaction(payload: AddTransactionDto): Promise<void>;
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
  ): Promise<TransactionModel[]>;
}
