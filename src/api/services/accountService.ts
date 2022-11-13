import {
  AccountModel,
  AccountExpenseAndIncomeModel,
  Client,
  AccountHistoryModel,
  ICreateAccountModel,
  CreateAccountModel
} from "src/api/client";
import { api } from "src/boot/axios";
import IAccountService from "../interfaces/accountService";

class AccountService implements IAccountService {
  async getAccountHistory(accountId: number): Promise<AccountHistoryModel[]> {
    const client = new Client(process.env.API_URL, api);
    const data = await client.account_GetAccountHistory(accountId);
    return data;
  }

  async getExpenseAndIncomeInTimePeriod(accountId: number): Promise<AccountExpenseAndIncomeModel> {
    const client = new Client(process.env.API_URL, api);
    const data = await client.account_GetExpenseAndIncomeInTimePeriod(accountId);
    return data;
  }

  async getLatestValues(): Promise<AccountModel[]> {
    const client = new Client(process.env.API_URL, api);
    const data = await client.account_GetUserAccounts();
    return data;
  }

  async create(payload: ICreateAccountModel): Promise<void> {
    const client = new Client(process.env.API_URL, api);
    await client.account_Create(new CreateAccountModel(payload));
  }
}

export default AccountService;
