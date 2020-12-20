import { GHistoryItem } from "@/models/history-item";

export interface IHistoryService {
  getHistoryByUserId(): Promise<GHistoryItem[]>;
}
