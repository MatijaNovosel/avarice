import {
  AddTransferDto,
  Client,
  IAddTransferDto,
  TransactionActivityHeatmapModel
} from "src/api/client";
import { api } from "src/boot/axios";
import { PageableCollection } from "src/models/common";
import { CreateTransactionModel, TransactionModel } from "src/models/transaction";
import { TRANSACTION_TYPE } from "src/utils/constants";
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

  async create({
    amount,
    accountId,
    categoryId,
    description,
    saveAsTemplate
  }: CreateTransactionModel): Promise<string> {
    const {
      data: {
        data: { createTransaction }
      }
    } = await api.post(`${process.env.API_URL}/graphql`, {
      query: `mutation {
        createTransaction(data: {
          amount: ${amount},
          description: "${description}",
          accountId: "${accountId}",
          categoryId: "${categoryId}",
          saveAsTemplate: ${saveAsTemplate},
          longitude: 0,
          latitude: 0
        }) {
          id
        }
      }`
    });
    return createTransaction.id;
  }

  async delete(id: number): Promise<void> {
    const {
      data: {
        data: { deleteTransaction }
      }
    } = await api.post(`${process.env.API_URL}/graphql`, {
      query: `mutation {
        deleteTransaction(data: {
          id: "${id}",
        })
      }`
    });
    return deleteTransaction;
  }

  async getAll(
    itemsPerPage: number,
    page: number,
    description?: string,
    transactionType?: string | null,
    categoryType?: number | null
  ): Promise<PageableCollection<TransactionModel>> {
    const {
      data: {
        data: {
          getTransactions: { edges, totalCount }
        }
      }
    } = await api.post(`${process.env.API_URL}/graphql`, {
      query: `query {
        getTransactions(
          query: "${description || ""}",
          pagination: {
            skip: ${itemsPerPage * page},
            take: ${itemsPerPage}
          },
          orderBy: {
            direction: desc,
            field: createdAt
          }
        ) {
          totalCount,
          edges {
            node {
              amount,
              id,
              description,
              createdAt,
              category {
                id,
                name,
                icon
              }
              account {
                name
              }
            }
          }
        }
      }`
    });
    return {
      total: totalCount,
      data: edges.map(({ node }: any) => ({
        ...node,
        createdAt: new Date(node.createdAt),
        account: node.account.name,
        transactionType: node.amount > 0 ? TRANSACTION_TYPE.INCOME : TRANSACTION_TYPE.EXPENSE
      }))
    };
  }

  async duplicate(id: number): Promise<void> {
    const {
      data: {
        data: { duplicateTransaction }
      }
    } = await api.post(`${process.env.API_URL}/graphql`, {
      query: `mutation {
        duplicateTransaction(data: {
          id: "${id}",
        })
      }`
    });
    return duplicateTransaction;
  }
}

export default TransactionService;
