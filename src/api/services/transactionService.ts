import {
  AddTransactionDto,
  AddTransferDto,
  Client,
  IAddTransactionDto,
  IAddTransferDto,
  PageableCollectionOfTransactionModel,
  TransactionActivityHeatmapModel
} from "src/api/client";
import { api } from "src/boot/axios";
import ITransactionService from "../interfaces/transactionService";

class TransactionService implements ITransactionService {
  async getHeatmap(): Promise<TransactionActivityHeatmapModel[]> {
    const client = new Client(process.env.API_URL, api);
    const data = await client.transaction_GetHeatmap();
    return data;
  }
  async transfer(payload: IAddTransferDto): Promise<void> {
    const client = new Client(process.env.API_URL, api);
    await client.transaction_Transfer(new AddTransferDto(payload));
  }
  async create(payload: IAddTransactionDto): Promise<void> {
    const client = new Client(process.env.API_URL, api);
    await client.transaction_Add(new AddTransactionDto(payload));
  }
  async delete(id: number): Promise<void> {
    const client = new Client(process.env.API_URL, api);
    await client.transaction_Delete(id);
  }
  async getAll(
    itemsPerPage: number,
    page: number,
    description?: string,
    transactionType?: string | null,
    categoryType?: number | null
  ): Promise<PageableCollectionOfTransactionModel> {
    const client = new Client(process.env.API_URL, api);
    const data = await client.transaction_Get(
      itemsPerPage * page,
      itemsPerPage,
      description,
      transactionType,
      categoryType
    );
    return data;
  }
}

export default TransactionService;
