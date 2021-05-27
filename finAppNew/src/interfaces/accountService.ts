import { AccountLatestValueModel } from "@/apiClient/client";
import {
  PaymentSource,
  TagPercentageRecord
} from "@/models/payment-source";

export interface IAccountService {
  getAllByUserId(userId: string): Promise<PaymentSource[]>;
  getLatestValues(userId: string): Promise<AccountLatestValueModel[]>;
  getTagPercentages(userId: string): Promise<TagPercentageRecord[]>;
  create(): Promise<void>;
}
