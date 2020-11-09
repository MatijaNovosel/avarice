import { CategoryEnum } from "@/constants/category-enum";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";

export interface ExpenseItem {
  paymentSource: PaymentSourceEnum | null;
  category: CategoryEnum | null;
  description: string | null;
  amount: string | null;
  date: Date | null;
}
