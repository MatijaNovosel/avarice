import { Timestamp } from "@firebase/firestore-types";

export interface GHistoryItem {
  id: number;
  gyro: number;
  checking: number;
  pocket: number;
  euros: number | null;
  createdAt: string;
}

export interface HistoryItem {
  gyro: number;
  checking: number;
  pocket: number;
  euros: number | null;
  date: Date;
}

export interface HistoryItemDto {
  gyro: number;
  checking: number;
  pocket: number;
  euros: number | null;
  date: Timestamp;
}
