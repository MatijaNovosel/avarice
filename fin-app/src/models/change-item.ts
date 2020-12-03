import { Timestamp } from "@firebase/firestore-types";
import { TagEnum } from "@/constants/tag-enum";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";

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
