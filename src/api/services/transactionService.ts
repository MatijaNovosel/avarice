import { api } from "src/boot/axios";
import { PageableCollection } from "src/models/common";
import {
  CreateTransactionModel,
  TransactionHeatmapModel,
  TransactionModel,
  TransferModel
} from "src/models/transaction";
import { TRANSACTION_TYPE } from "src/utils/constants";
import ITransactionService from "../interfaces/transactionService";

class TransactionService implements ITransactionService {
  async getHeatmap(): Promise<TransactionHeatmapModel[]> {
    const {
      data: {
        data: { getHeatmap }
      }
    } = await api.post("", {
      query: `query {
        getHeatmap {
          date,
          value,
          week,
          weekDay
        }
      }`
    });
    return getHeatmap.map((a: any) => ({
      date: a.amount,
      value: a.value,
      week: a.week,
      weekDay: a.weekDay
    }));
  }

  async transfer(payload: TransferModel): Promise<string[]> {
    const {
      data: {
        data: { transfer }
      }
    } = await api.post("", {
      query: `mutation {
        transfer(data: {
          accountFromId: "${payload.accountFromId}",
          accountToId: "${payload.accountToId}",
          amount: ${payload.amount},
        })
      }`
    });
    return transfer;
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
    } = await api.post("", {
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
    } = await api.post("", {
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
    } = await api.post("", {
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
                icon,
                color
              }
              account {
                name,
                id
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
        transactionType: node.amount > 0 ? TRANSACTION_TYPE.INCOME : TRANSACTION_TYPE.EXPENSE
      }))
    };
  }

  async duplicate(id: number): Promise<void> {
    const {
      data: {
        data: { duplicateTransaction }
      }
    } = await api.post("", {
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
