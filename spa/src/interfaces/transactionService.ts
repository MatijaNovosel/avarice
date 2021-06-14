import {
  AddTransactionDto,
  CreateTransferDto,
  TransactionAmountRange
} from "@/models/transaction";
import { PageableCollectionOfTransactionModel } from "@/apiClient/client";

export interface ITransactionService {
  addTransaction(payload: AddTransactionDto): Promise<void>;
  getTransactionAmountRange(
    expense?: boolean | null
  ): Promise<TransactionAmountRange>;
  transfer(payload: CreateTransferDto): Promise<void>;
  getTransactions(
    skip?: number | null,
    take?: number | null
  ): Promise<PageableCollectionOfTransactionModel>;
}
