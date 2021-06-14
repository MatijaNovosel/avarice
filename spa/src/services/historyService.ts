import {
  RecentDepositsAndWithdrawalsModel,
  HistoryTotalModel,
  DailyChangeModel,
  Client
} from "@/apiClient/client";
import { IHistoryService } from "@/interfaces/historyService";

export class HistoryService implements IHistoryService {
  async getLatestDate(): Promise<Date> {
    const client = new Client();
    const data = await client.history_LatestDate();
    return data;
  }

  async getRecentDepositsAndWithdrawals(): Promise<
    RecentDepositsAndWithdrawalsModel
  > {
    const client = new Client();
    const data = await client.history_RecentDepositsAndWithdrawals();
    return data;
  }

  async getTotal(from?: Date, to?: Date): Promise<HistoryTotalModel[]> {
    const client = new Client();
    const data = await client.history_Total(from, to);
    return data;
  }

  async getDailyChanges(): Promise<DailyChangeModel[]> {
    const client = new Client();
    const data = await client.history_DailyChanges();
    return data;
  }

  async getHistoryForAccount(
    from: Date,
    to: Date,
    accountId: number
  ): Promise<HistoryTotalModel[]> {
    const client = new Client();
    const data = client.history_AccountHistory(accountId, from, to);
    return data;
  }

  async getHistoryForAccountTotal(
    accountId: number
  ): Promise<HistoryTotalModel[]> {
    const client = new Client();
    const data = client.history_AccountHistoryTotal(accountId);
    return data;
  }
}
