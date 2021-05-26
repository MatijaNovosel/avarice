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

  getLatestValues(userId: string): Promise<AccountLatestValue[]> {
    throw new Error("Method not implemented.");
  }

  getTagPercentages(userId: string): Promise<TagPercentageRecord[]> {
    throw new Error("Method not implemented.");
  }

  create(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
