import { AccountLatestValueModel, AccountModel } from "@/apiClient/client";
import { TagPercentageRecord } from "@/models/payment-source";

export interface IAccountService {
  getAllByUserId(userId: string): Promise<AccountModel[]>;
  getLatestValues(userId: string): Promise<AccountLatestValueModel[]>;
  getTagPercentages(userId: string): Promise<TagPercentageRecord[]>;
  create(): Promise<void>;
}
