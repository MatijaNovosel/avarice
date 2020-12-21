import {
  CreateFinancialChangeItemDto,
  GFinancialChangeItem
} from "@/models/change-item";
import { GFinancialHistoryItem } from "@/models/history-item";
import axios from "axios";
import environmentVariables from "@/constants/environment-variables.json";
import { IChangeServiceGql } from "../interfaces/change-service";

export class ChangeService implements IChangeServiceGql {
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
              description: ${description}
              expense: ${expense}
              paymentSourceId: ${paymentSourceId}
              tagIds: [${tagIds.join(",")}]
            }
          )
        }
      `
    });
  }
  async getChanges(appUserId: number): Promise<GFinancialChangeItem[]> {
    const { data } = await axios.post(environmentVariables.apiUrl, {
      query: `
        query {
          financialChanges(id: ${appUserId}) {
            id
            amount
            createdAt
            description
            expense
            paymentSourceId
            tagIds
          }
        }
      `
    });
    return data.data.financialChanges;
  }
  async getHistory(appUserId: number): Promise<GFinancialHistoryItem[]> {
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
          }
        }
      `
    });
    return data.data.financialHistory;
  }
}
