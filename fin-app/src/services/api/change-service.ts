import { ItemCollection } from "./../../models/item-collection";
import {
  CreateFinancialChangeItemDto,
  FinancialChangeItem
} from "@/models/change-item";
import { FinancialHistoryItem } from "@/models/history-item";
import axios from "axios";
import environmentVariables from "@/constants/environment-variables.json";
import { IChangeService } from "../interfaces/change-service";

export class ChangeService implements IChangeService {
  async addChange(payload: CreateFinancialChangeItemDto): Promise<void> {
    const {
      appUserId,
      amount,
      description,
      expense,
      paymentSourceId,
      tagIds
    } = payload;

    await axios.post(environmentVariables.apiUrl, {
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
    skip?: number,
    take?: number
  ): Promise<ItemCollection<FinancialChangeItem>> {
    const { data } = await axios.post(environmentVariables.apiUrl, {
      query: `
        query {
          financialChanges(id: ${appUserId}, take: ${take ||
        null}, skip: ${skip || null}) {
            count
            items {
              id
              amount
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
    return data.data.financialChanges;
  }
  async getHistory(appUserId: number): Promise<FinancialHistoryItem[]> {
    const { data } = await axios.post(environmentVariables.apiUrl, {
      query: `
        query {
          financialHistory(id: ${appUserId}) {
            id
            createdAt
            checking
            gyro
            pocket
            total
            euros
            euroVal
          }
        }
      `
    });
    return data.data.financialHistory;
  }
}
