import { PaymentSourceEnum } from "@/constants/payment-source-enum";

export interface GainItem {
  paymentSource: PaymentSourceEnum | null;
  description: string | null;
  amount: string | null;
  date: Date | null;
}
