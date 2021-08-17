import { PageableCollectionOfTransactionModel } from "src/api/client";

export default interface ITransactionService {
  getAll(): Promise<PageableCollectionOfTransactionModel>;
}
