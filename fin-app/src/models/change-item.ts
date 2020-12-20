import { Timestamp } from "@firebase/firestore-types";
import { TagEnum } from "@/constants/tag-enum";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";
import { EntityWithId } from "./generic";

export interface ChangeItem {
  uid?: string;
  paymentSource: PaymentSourceEnum;
  tags: TagEnum[];
  description: string;
  amount: number;
  date: Date;
  expense: boolean;
}

export interface ChangeItemDto {
  uid?: string;
  paymentSource: PaymentSourceEnum;
  tags: TagEnum[];
  description: string;
  amount: number;
  date: Timestamp;
  expense: boolean;
}

export interface GFinancialChangeItemDto {
  id: number;
  amount: number;
  createdAt: string;
  description: string;
  expense: boolean;
  paymentSource: EntityWithId;
  tags: EntityWithId[];
}

export interface GFinancialChangeItem {
  id: number;
  amount: number;
  createdAt: string;
  description: string;
  expense: boolean;
  paymentSourceId: number;
  tagIds: number[];
}

export interface CreateFinancialChangeItemDto {
  appUserId: number;
  amount: number;
  description: string;
  expense: boolean;
  paymentSourceId: number;
  tagIds: number[];
}
