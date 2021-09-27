import {
  IAddTransactionDto,
  IAddTransferDto,
  PageableCollectionOfTransactionModel,
  TransactionActivityHeatmapModel
} from "src/api/client";

export default interface ITransactionService {
  getAll(description?: string): Promise<PageableCollectionOfTransactionModel>;
  getHeatmap(): Promise<TransactionActivityHeatmapModel[]>;
  create(payload: IAddTransactionDto): Promise<void>;
  transfer(payload: IAddTransferDto): Promise<void>;
  delete(id: number): Promise<void>;
}
