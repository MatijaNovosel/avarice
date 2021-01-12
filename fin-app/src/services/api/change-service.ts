import { ItemCollection } from "./../../models/item-collection";
import {
  CreateFinancialChangeItemDto,
  FinancialChangeItem
} from "@/models/change-item";
import { FinancialHistory } from "@/models/history-item";
import axios from "axios";
import environmentVariables from "@/constants/environment-variables.json";
import { IChangeService } from "../interfaces/change-service";
import { format } from "date-fns";

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
    const { data: { data: { financialChanges } } } = await axios.post(environmentVariables.apiUrl, {
      query: `
        query {
          financialChanges(id: ${appUserId}, take: ${take || null}, skip: ${skip || null}) {
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
    return financialChanges;
  }

  async getHistory(appUserId: number, from: Date, to: Date): Promise<FinancialHistory[]> {
    const { data: { data: { financialHistory } } } = await axios.post(environmentVariables.apiUrl, {
      query: `
        query {
          financialHistory(id: ${appUserId}, from: "${format(from, "yyyy-MM-dd HH:mm:ss")}", to: "${format(to, "yyyy-MM-dd HH:mm:ss")}") {
            createdAt
            paymentSources {
              id
              amount
            }
            total
          }
        }
      `
    });
    return financialHistory;
  }
}
