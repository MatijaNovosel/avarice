import { PaymentSource } from "@/models/payment-source";

export interface IPaymentSourceService {
  getAllByUserId(appUserId: number): Promise<PaymentSource[]>;
  create(payload: Object): Promise<void>;
}
