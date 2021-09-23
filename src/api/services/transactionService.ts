import {
  IAddTransactionDto,
  AddTransactionDto,
  IAddTransferDto,
  AddTransferDto,
  Client,
  PageableCollectionOfTransactionModel
} from "src/api/client";
import { api } from "src/boot/axios";
import CONSTANTS from "src/utils/constants";
import ITransactionService from "../interfaces/transactionService";

class TransactionService implements ITransactionService {
  async transfer(payload: IAddTransferDto): Promise<void> {
    const client = new Client(CONSTANTS.API_URL, api);
    await client.transaction_Transfer(new AddTransferDto(payload));
  }
  async create(payload: IAddTransactionDto): Promise<void> {
    const client = new Client(CONSTANTS.API_URL, api);
    await client.transaction_Add(new AddTransactionDto(payload));
  }
  async delete(id: number): Promise<void> {
    const client = new Client(CONSTANTS.API_URL, api);
    await client.transaction_Delete(id);
  }
  async getAll(description?: string): Promise<PageableCollectionOfTransactionModel> {
    const client = new Client(CONSTANTS.API_URL, api);
    const data = await client.transaction_Get(0, 25, description);
    return data;
  }
}

export default TransactionService;
