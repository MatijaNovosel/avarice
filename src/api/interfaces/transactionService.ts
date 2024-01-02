import { PageableCollection } from "src/models/common";
import {
  CreateTransactionModel,
  EditTransactionModel,
  TransactionHeatmapModel,
  TransactionModel,
  TransferModel
} from "src/models/transaction";

export default interface ITransactionService {
  getAll(
    itemsPerPage: number,
    page: number,
    description?: string,
    transactionType?: string | null,
    categoryType?: number | null
  ): Promise<PageableCollection<TransactionModel>>;
  getHeatmap(): Promise<TransactionHeatmapModel[]>;
  create(payload: CreateTransactionModel): Promise<string>;
  transfer(payload: TransferModel): Promise<string[]>;
  delete(id: number): Promise<void>;
  edit(payload: EditTransactionModel): Promise<string>;
  duplicate(id: number): Promise<void>;
}
