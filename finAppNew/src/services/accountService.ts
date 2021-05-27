import { AccountLatestValueModel, Client } from "@/apiClient/client";
import { IAccountService } from "@/interfaces/accountService";
import {
  AccountLatestValue,
  PaymentSource,
  TagPercentageRecord
} from "@/models/payment-source";

export class AccountService implements IAccountService {
  getAllByUserId(userId: string): Promise<PaymentSource[]> {
    throw new Error("Method not implemented.");
  }

  async getLatestValues(userId: string): Promise<AccountLatestValueModel[]> {
    const client = new Client();
    const data = await client.account_LatestValues(userId);
    return data; 
  }

  getTagPercentages(userId: string): Promise<TagPercentageRecord[]> {
    throw new Error("Method not implemented.");
  }

  create(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
