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
    take?: number | null
  ): Promise<TransactionModel[]>;
}
