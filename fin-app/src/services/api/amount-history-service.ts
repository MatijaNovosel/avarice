import { db } from "../firebase";
import { ExpenseItem } from "@/models/expense-item";
import { GainItem } from "@/models/gain-item";
import { HistoryItemDto, HistoryItem } from "@/models/history-item";

export class AmountHistoryService {
  async addExpense(payload: ExpenseItem): Promise<void> {
    await db.collection("expense").add(payload);
  }
  async addHistory(payload: HistoryItem): Promise<void> {
    await db.collection("history").add(payload);
  }
  async addGain(payload: GainItem): Promise<void> {
    await db.collection("gain").add(payload);
  }
  async getHistory(): Promise<Array<HistoryItemDto>> {
    const res: Array<HistoryItemDto> = [];
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
