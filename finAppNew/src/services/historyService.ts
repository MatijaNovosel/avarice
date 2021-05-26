import {
  RecentDepositsAndWithdrawalsModel,
  HistoryTotalModel,
  DailyChangeModel
} from "@/apiClient/client";
import { IHistoryService } from "@/interfaces/historyService";

export class HistoryService implements IHistoryService {
  getLatestDate(userId: string): Promise<Date> {
    throw new Error("Method not implemented.");
  }

  getRecentDepositsAndWithdrawals(
    userId: string
  ): Promise<RecentDepositsAndWithdrawalsModel> {
    throw new Error("Method not implemented.");
  }

  getTotal(
    userId: string,
    from?: Date | null,
    to?: Date | null
  ): Promise<HistoryTotalModel[]> {
    throw new Error("Method not implemented.");
  }

  getDailyChanges(userId: string): Promise<DailyChangeModel[]> {
    throw new Error("Method not implemented.");
  }
}
