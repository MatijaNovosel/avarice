import {
  IAddTransactionDto,
  IAddTransferDto,
  TransactionActivityHeatmapModel
} from "src/api/client";
import { PageableCollection } from "src/models/common";
import { TransactionModel } from "src/models/transaction";

export default interface ITransactionService {
  getAll(
    itemsPerPage: number,
    page: number,
    description?: string,
    transactionType?: string | null,
    categoryType?: number | null
  ): Promise<PageableCollection<TransactionModel>>;
  getHeatmap(): Promise<TransactionActivityHeatmapModel[]>;
  create(payload: IAddTransactionDto): Promise<void>;
  transfer(payload: IAddTransferDto): Promise<void>;
  delete(id: number): Promise<void>;
  duplicate(id: number): Promise<void>;
}
