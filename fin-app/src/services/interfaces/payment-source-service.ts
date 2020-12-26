import { PaymentSource } from "@/models/payment-source";

export interface IPaymentSourceService {
  getAllByUserId(appUserId: number): Promise<PaymentSource[]>;
  create(): Promise<void>;
}
