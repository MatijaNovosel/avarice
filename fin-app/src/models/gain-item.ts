import { PaymentSourceEnum } from "@/constants/payment-source-enum";

export interface GainItem {
  paymentSource: PaymentSourceEnum;
  description: string;
  amount: number;
  date: Date;
}
