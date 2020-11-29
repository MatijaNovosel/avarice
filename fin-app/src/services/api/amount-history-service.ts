import { ChangeItemDto } from "./../../models/change-item";
import { CategoryEnum } from "./../../constants/category-enum";
import { db } from "../firebase";
import { ChangeItem } from "@/models/change-item";
import { HistoryItemDto, HistoryItem } from "@/models/history-item";

interface Filter {
  category: CategoryEnum[];
  amountRange: number[];
}

export class AmountHistoryService {
  async addChange(payload: ChangeItem): Promise<void> {
    await db.collection("changes").add(payload);
  }
  async addHistory(payload: HistoryItem): Promise<void> {
    await db.collection("history").add(payload);
  }
  async getChanges(filterOptions?: Filter): Promise<ChangeItem[]> {
    const res: ChangeItem[] = [];
    const data = await db
      .collection("changes")
      .where(
        "category",
        "in",
        filterOptions?.category != undefined &&
          filterOptions?.category.length != 0
          ? filterOptions?.category
          : [
              CategoryEnum.Food,
              CategoryEnum.Games,
              CategoryEnum.Gifts,
              CategoryEnum.Other,
              CategoryEnum.PublicTransport
            ]
      )
      .orderBy("date", "desc")
      .get();
    data.forEach(document => {
      const doc = document.data() as ChangeItemDto;
      res.push({
        amount: doc.amount,
        category: doc.category,
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
