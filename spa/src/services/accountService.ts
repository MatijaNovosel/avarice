import {
  AccountLatestValueModel,
  AccountModel,
  Client
} from "@/apiClient/client";
import { IAccountService } from "@/interfaces/accountService";
import { TagPercentageRecord } from "@/models/payment-source";

export class AccountService implements IAccountService {
  async getAllByUserId(): Promise<AccountModel[]> {
    const client = new Client();
    const data = await client.account_GetUserAccounts();
    return data;
  }

  async getLatestValues(): Promise<AccountLatestValueModel[]> {
    const client = new Client();
    const data = await client.account_GetLatestValues();
    return data;
  }

  getTagPercentages(): Promise<TagPercentageRecord[]> {
    throw new Error("Method not implemented.");
  }

  create(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
