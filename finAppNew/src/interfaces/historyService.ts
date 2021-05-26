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
}
