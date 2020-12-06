import { IChangeService } from "./../interfaces/change-service";
import { ChangeItemDto } from "../../models/change-item";
import { db } from "../firebase";
import { ChangeItem } from "@/models/change-item";
import { HistoryItemDto, HistoryItem } from "@/models/history-item";

export class ChangeService implements IChangeService {
  async addChange(payload: ChangeItem): Promise<void> {
    await db.collection("changges").add(payload);
  }
  async addHistory(payload: HistoryItem): Promise<void> {
    await db.collection("history").add(payload);
  }
  async getChanges(): Promise<ChangeItem[]> {
    const res: ChangeItem[] = [];
    const data = await db
      .collection("changges")
      .orderBy("date", "desc")
      .get();
    data.forEach(document => {
      const doc = document.data() as ChangeItemDto;
      res.push({
        uid: document.id,
        amount: doc.amount,
        tags: doc.tags,
        date: doc.date.toDate(),
        description: doc.description,
        expense: doc.expense,
        paymentSource: doc.paymentSource
      });
    });
    return res;
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
  async getCurrentAmount(): Promise<HistoryItemDto> {
    const data = await db
      .collection("history")
      .orderBy("date", "desc")
      .limit(1)
      .get();
    return data.docs[0].data() as HistoryItemDto;
  }
}
