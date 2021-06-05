import {
  AccountLatestValueModel,
  AccountModel,
  Client
} from "@/apiClient/client";
import { IAccountService } from "@/interfaces/accountService";
import { TagPercentageRecord } from "@/models/payment-source";

export class AccountService implements IAccountService {
  async getAllByUserId(userId: string): Promise<AccountModel[]> {
    const client = new Client();
    const data = await client.account_GetUserAccounts(userId);
    return data;
  }

  async getLatestValues(userId: string): Promise<AccountLatestValueModel[]> {
    const client = new Client();
    const data = await client.account_GetLatestValues(userId);
    return data;
  }

  getTagPercentages(userId: string): Promise<TagPercentageRecord[]> {
    throw new Error("Method not implemented.");
  }

  create(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
