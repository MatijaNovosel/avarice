import { db } from "../firebase";
import { Timestamp } from "@firebase/firestore-types";

interface HistoryItem {
  gyro: string;
  checking: string;
  pocket: string;
  date: Timestamp;
}

export class AmountHistoryService {
  async addHistoryItem(): Promise<void> {
    //
  }
  async getHistory(): Promise<Array<HistoryItem>> {
    const res: Array<HistoryItem> = [];
    const data = await db
      .collection("history")
      .orderBy("date", "desc")
      .get();
    data.forEach(document => {
      res.push(document.data() as HistoryItem);
    });
    return res;
  }
}
