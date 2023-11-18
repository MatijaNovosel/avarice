import {
  AccountExpenseAndIncomeModel,
  AccountHistoryModel,
  Client,
  CreateAccountModel,
  ICreateAccountModel
} from "src/api/client";
import { api } from "src/boot/axios";
import { AccountModel } from "src/models/account";
import IAccountService from "../interfaces/accountService";

class AccountService implements IAccountService {
  async getAccountHistory(accountId: number, timePeriod: number): Promise<AccountHistoryModel[]> {
    const client = new Client(process.env.API_URL, api);
    const data = await client.account_GetAccountHistory(accountId, timePeriod);
    return data;
  }

  async getExpenseAndIncomeInTimePeriod(accountId: string): Promise<AccountExpenseAndIncomeModel> {
    const client = new Client(process.env.API_URL, api);
    const data = await client.account_GetExpenseAndIncomeInTimePeriod(1);
    return data;
  }

  async getLatestValues(): Promise<AccountModel[]> {
    const {
      data: {
        data: { getUserAccounts }
      }
    } = await api.post("http://localhost:3000/graphql", {
      query: `query {
        getUserAccounts {
          id,
          name,
          currency,
          balance
        }
      }`
    });
    return (getUserAccounts as any[]).map<AccountModel>((a) => ({
      balance: a.balance,
      id: a.id,
      name: a.name,
      currency: a.currency
    }));
  }

  async create(payload: ICreateAccountModel): Promise<void> {
    const client = new Client(process.env.API_URL, api);
    await client.account_Create(new CreateAccountModel(payload));
  }
}

export default AccountService;
