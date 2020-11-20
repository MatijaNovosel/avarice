import { CategoryEnum } from "@/constants/category-enum";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";

export interface ExpenseItem {
  paymentSource: PaymentSourceEnum;
  category: CategoryEnum;
  description: string;
  amount: number;
  date: Date;
}
