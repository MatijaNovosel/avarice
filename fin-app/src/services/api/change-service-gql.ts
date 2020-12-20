import { db } from "../firebase";
import {
  CreateFinancialChangeItemDto,
  GFinancialChangeItem,
  GFinancialChangeItemDto
} from "@/models/change-item";
import { HistoryItemDto } from "@/models/history-item";
import axios from "axios";
import environmentVariables from "@/constants/environment-variables.json";
import { IChangeServiceGql } from "../interfaces/change-service";
import { format } from "date-fns";

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
            id,
            amount,
            createdAt,
            description,
            expense,
            paymentSource { id },
            tags { id }
          }
        }
      `
    });
    const changeItems: GFinancialChangeItemDto[] = data.data.financialChanges;
    return changeItems.map(x => {
      return {
        id: x.id,
        amount: x.amount,
        createdAt: format(new Date(x.createdAt), "dd.MM.yyyy HH:mm"),
        description: x.description,
        expense: x.expense,
        paymentSourceId: x.paymentSource.id,
        tagIds: x.tags.map(y => y.id)
      } as GFinancialChangeItem;
    });
  }
  async getHistory(): Promise<HistoryItemDto[]> {
    const res: HistoryItemDto[] = [];
    const data = await db
      .collection("history")
      .orderBy("date", "asc")
      .get();
    data.forEach(document => {
      res.push(document.data() as HistoryItemDto);
    });
    return res;
  }
}
