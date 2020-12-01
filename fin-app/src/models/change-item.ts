import { Timestamp } from "@firebase/firestore-types";
import { CategoryEnum } from "@/constants/category-enum";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";

export interface ChangeItem {
  uid: string;
  paymentSource: PaymentSourceEnum;
  category: CategoryEnum;
  description: string;
  amount: number;
  date: Date;
  expense: boolean;
}

export interface ChangeItemDto {
  paymentSource: PaymentSourceEnum;
  category: CategoryEnum;
  description: string;
  amount: number;
  date: Timestamp;
  expense: boolean;
}
