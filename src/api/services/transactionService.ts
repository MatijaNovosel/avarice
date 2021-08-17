import { Client, PageableCollectionOfTransactionModel } from "src/api/client";
import { api } from "src/boot/axios";
import CONSTANTS from "src/utils/constants";
import ITransactionService from "../interfaces/transactionService";

class TransactionService implements ITransactionService {
  async getAll(): Promise<PageableCollectionOfTransactionModel> {
    const client = new Client(CONSTANTS.API_URL, api);
    const data = await client.transaction_Get(0, 25);
    return data;
  }
}

export default TransactionService;
