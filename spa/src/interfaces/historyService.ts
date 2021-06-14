import {
  DailyChangeModel,
  HistoryTotalModel,
  RecentDepositsAndWithdrawalsModel
} from "@/apiClient/client";

export interface IHistoryService {
  getRecentDepositsAndWithdrawals(): Promise<RecentDepositsAndWithdrawalsModel>;
  getTotal(from?: Date | null, to?: Date | null): Promise<HistoryTotalModel[]>;
  getDailyChanges(): Promise<DailyChangeModel[]>;
  getLatestDate(): Promise<Date>;
  getHistoryForAccount(
    from: Date,
    to: Date,
    accountId: number
  ): Promise<HistoryTotalModel[]>;
  getHistoryForAccountTotal(accountId: number): Promise<HistoryTotalModel[]>;
}
