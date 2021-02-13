import { CreateTransferDto, DailyChange, RecentDepositsAndWithdrawals, TransactionAmountRange, DailyChangeDto } from './../../models/change-item';
import { ItemCollection } from "../../models/item-collection";
import {
  CreateFinancialChangeItemDto,
  FinancialChangeItem
} from "@/models/change-item";
import { FinancialHistory } from "@/models/history-item";
import axiosInstance from "../axios-instance";
import { ITransactionService } from "../interfaces/transaction-service";
import { format } from "date-fns";
import { formatGqlRequest } from '@/helpers/helpers';

export class ChangeService implements ITransactionService {
  async getRecentDepositsAndWithdrawals(appUserId: number): Promise<RecentDepositsAndWithdrawals> {
    const query = formatGqlRequest({
      type: "query",
      name: "recentDepositsAndWithdrawals",
      requestParams: [{
        name: "appUserId",
        value: appUserId
      }],
      responseParams: [{
        name: "deposits"
      }, {
        name: "withdrawals"
      }]
    });

    const { data: { data: { recentDepositsAndWithdrawals } } } = await axiosInstance.post("", {
      query
    });

    return recentDepositsAndWithdrawals;
  }

  async transfer(payload: CreateTransferDto): Promise<void> {
    const {
      appUserId,
      amount,
      accountFromId,
      accountToId
    } = payload;

    await axiosInstance.post("", {
      query: `
        mutation {
          transfer(
            transfer: {
              appUserId: ${appUserId}
              amount: ${amount}
              accountFromId: ${accountFromId}
              accountToId: ${accountToId}
            }
          )
        }
      `
    });
  }

  async addChange(payload: CreateFinancialChangeItemDto): Promise<void> {
    const {
      appUserId,
      amount,
      description,
      expense,
      paymentSourceId,
      tagIds
    } = payload;

    await axiosInstance.post("", {
      query: `
        mutation {
          addFinancialChange(
            financialChange: {
              appUserId: ${appUserId}
              amount: ${amount}
              description: "${description}"
              expense: ${expense}
              paymentSourceId: ${paymentSourceId}
              tagIds: [${tagIds.join(",")}]
            }
          )
        }
      `
    });
  }
  
  async getChanges(
    appUserId: number,
    skip: number | null = null,
    take: number | null = null,
    description = "",
    min: number | null = null,
    max: number | null = null
  ): Promise<ItemCollection<FinancialChangeItem>> {
    const { data: { data: { financialChanges } } } = await axiosInstance.post("", {
      query: `
        query {
          financialChanges(id: ${appUserId}, take: ${take}, skip: ${skip}, description: "${description}", min: ${min}, max: ${max}) {
            count
            items {
              id
              amount
              transfer
              createdAt
              description
              expense
              paymentSourceId
              tagIds
            }
          }
        }
      `
    });
    return financialChanges;
  }

  async getHistory(appUserId: number, from: Date, to: Date): Promise<FinancialHistory[]> {
    const { data: { data: { financialHistory } } } = await axiosInstance.post("", {
      query: `
        query {
          financialHistory(id: ${appUserId}, from: "${format(from, "yyyy-MM-dd HH:mm:ss")}", to: "${format(to, "yyyy-MM-dd HH:mm:ss")}") {
            createdAt
            paymentSources {
              id
              amount
            }
            total
          }
        }
      `
    });
    return financialHistory;
  }

  async getTotal(appUserId: number, from: Date, to: Date): Promise<FinancialHistory[]> {
    const { data: { data: { financialHistory } } } = await axiosInstance.post("", {
      query: `
        query {
          financialHistory(id: ${appUserId}, from: "${format(from, "yyyy-MM-dd HH:mm:ss")}", to: "${format(to, "yyyy-MM-dd HH:mm:ss")}") {
            createdAt
            total
          }
        }
      `
    });
    return financialHistory;
  }

  async getTransactionAmountRange(appUserId: number, expense: boolean | null = null): Promise<TransactionAmountRange> {
    const { data: { data: { transactionAmountRange } } } = await axiosInstance.post("", {
      query: `
        query {
          transactionAmountRange(appUserId: ${appUserId}, expense: ${expense}) {
            min
            max
          }
        }
      `
    });
    return transactionAmountRange;
  }

  async getDailyChanges(appUserId: number): Promise<DailyChange[]> {
    const { data: { data: { dailyChanges } } } = await axiosInstance.post("", {
      query: `
        query {
          dailyChanges(appUserId: ${appUserId}) {
            withdrawals
            deposits
            createdAt
          }
        }
      `
    });
    return dailyChanges.map((x: DailyChangeDto) => ({
      withdrawals: x.withdrawals,
      deposits: x.deposits,
      createdAt: new Date(parseInt(x.createdAt))
    }));
  }
}
