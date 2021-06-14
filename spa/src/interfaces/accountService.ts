import { AccountLatestValueModel, AccountModel } from "@/apiClient/client";
import { TagPercentageRecord } from "@/models/payment-source";

export interface IAccountService {
  getAllByUserId(): Promise<AccountModel[]>;
  getLatestValues(): Promise<AccountLatestValueModel[]>;
  getTagPercentages(): Promise<TagPercentageRecord[]>;
  create(): Promise<void>;
}
