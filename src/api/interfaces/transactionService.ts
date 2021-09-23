import {
  IAddTransactionDto,
  IAddTransferDto,
  PageableCollectionOfTransactionModel
} from "src/api/client";

export default interface ITransactionService {
  getAll(description?: string): Promise<PageableCollectionOfTransactionModel>;
  create(payload: IAddTransactionDto): Promise<void>;
  transfer(payload: IAddTransferDto): Promise<void>;
  delete(id: number): Promise<void>;
}
