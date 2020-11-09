import { Timestamp } from "@firebase/firestore-types";

export interface HistoryItem {
  gyro: string;
  checking: string;
  pocket: string;
  date: Date;
};

export interface HistoryItemDto {
  gyro: string;
  checking: string;
  pocket: string;
  date: Timestamp;
};