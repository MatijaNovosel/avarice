import {
  RecentDepositsAndWithdrawalsModel,
  HistoryTotalModel,
  DailyChangeModel,
  Client
} from "@/apiClient/client";
import { IHistoryService } from "@/interfaces/historyService";

export class HistoryService implements IHistoryService {
  async getLatestDate(userId: string): Promise<Date> {
    const client = new Client();
    const data = await client.history_LatestDate(userId);
    return data;
  }

  async getRecentDepositsAndWithdrawals(
    userId: string
  ): Promise<RecentDepositsAndWithdrawalsModel> {
    const client = new Client();
    const data = await client.history_RecentDepositsAndWithdrawals(userId);
    return data;
  }

  async getTotal(
    userId: string,
    from?: Date,
    to?: Date
  ): Promise<HistoryTotalModel[]> {
    const client = new Client();
    const data = await client.history_Total(userId, from, to);
    return data;
  }

  async getDailyChanges(userId: string): Promise<DailyChangeModel[]> {
    const client = new Client();
    const data = await client.history_DailyChanges(userId);
    return data;
  }
}
