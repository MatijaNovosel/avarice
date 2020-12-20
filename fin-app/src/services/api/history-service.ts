import { IHistoryService } from "./../interfaces/history-service";
import { GHistoryItem } from "@/models/history-item";
import axios from "axios";
import environmentVariables from "@/constants/environment-variables.json";

export class HistoryService implements IHistoryService {
  async getHistoryByUserId(): Promise<GHistoryItem[]> {
    const response = await axios.post(environmentVariables.apiUrl, {
      query: `
        query {
            financialHistory(id: 1) {
              id,
              createdAt,
              checking,
              gyro,
              pocket,
              euros,
              appUserId
          }
        }
      `
    });
    return response.data.data.financialHistory;
  }
}
