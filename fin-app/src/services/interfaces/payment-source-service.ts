import { AccountLatestValue, PaymentSource } from "@/models/payment-source";

export interface IPaymentSourceService {
  getAllByUserId(appUserId: number): Promise<PaymentSource[]>;
  getLatestValues(appUserId: number): Promise<AccountLatestValue[]>;
  create(): Promise<void>;
}
