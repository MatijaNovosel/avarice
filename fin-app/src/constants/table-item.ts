import { Timestamp } from '@firebase/firestore-types';
import { PaymentSourceEnum } from "@/constants/payment-source-enum";
import { CategoryEnum } from "@/constants/category-enum";

export interface TableItem {
  paymentSource: PaymentSourceEnum;
  category: CategoryEnum | null;
  description: string;
  amount: string;
  date: Timestamp;
  expense: boolean;
}