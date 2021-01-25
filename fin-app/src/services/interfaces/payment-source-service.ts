import {
  AccountLatestValue,
  PaymentSource,
  TagPercentageRecord
} from "@/models/payment-source";

export interface IPaymentSourceService {
  getAllByUserId(appUserId: number): Promise<PaymentSource[]>;
  getLatestValues(appUserId: number): Promise<AccountLatestValue[]>;
  getTagPercentages(appUserId: number): Promise<TagPercentageRecord[]>;
  create(): Promise<void>;
}
