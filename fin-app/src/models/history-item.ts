import { Timestamp } from "@firebase/firestore-types";

export interface HistoryItem {
  gyro: number;
  checking: number;
  pocket: number;
  date: Date;
}

export interface HistoryItemDto {
  gyro: number;
  checking: number;
  pocket: number;
  date: Timestamp;
}
