import { db } from "../firebase";
import { Timestamp } from "@firebase/firestore-types";

interface CurrentAmountModel {
  val: string;
  addedAt: Timestamp;
}

export class CurrentAmountService {
  async getCurrentAmount(): Promise<CurrentAmountModel> {
    const data = await db
      .collection("current-amount")
      .orderBy("added-at", "desc")
      .limit(1)
      .get();
    return data.docs[0].data() as CurrentAmountModel;
  }
}
