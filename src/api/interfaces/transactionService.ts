import { IAddTransferDto } from "src/api/client";
import { PageableCollection } from "src/models/common";
import {
  CreateTransactionModel,
  TransactionHeatmapModel,
  TransactionModel
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
  transfer(payload: IAddTransferDto): Promise<void>;
  delete(id: number): Promise<void>;
  duplicate(id: number): Promise<void>;
}
