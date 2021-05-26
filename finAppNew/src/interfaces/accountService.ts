import {
  AccountLatestValue,
  PaymentSource,
  TagPercentageRecord
} from "@/models/payment-source";

export interface IAccountService {
  getAllByUserId(userId: string): Promise<PaymentSource[]>;
  getLatestValues(userId: string): Promise<AccountLatestValue[]>;
  getTagPercentages(userId: string): Promise<TagPercentageRecord[]>;
  create(): Promise<void>;
}
