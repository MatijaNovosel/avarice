import {
  DailyChangeModel,
  HistoryTotalModel,
  RecentDepositsAndWithdrawalsModel
} from "@/apiClient/client";

export interface IHistoryService {
  getRecentDepositsAndWithdrawals(
    userId: string
  ): Promise<RecentDepositsAndWithdrawalsModel>;
  getTotal(
    userId: string,
    from?: Date | null,
    to?: Date | null
  ): Promise<HistoryTotalModel[]>;
  getDailyChanges(userId: string): Promise<DailyChangeModel[]>;
  getLatestDate(userId: string): Promise<Date>;
  getHistoryForAccount(
    userId: string,
    from: Date,
    to: Date,
    accountId: number
  ): Promise<HistoryTotalModel[]>;
  getHistoryForAccountTotal(
    userId: string,
    accountId: number
  ): Promise<HistoryTotalModel[]>;
}
