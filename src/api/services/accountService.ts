import {
  AccountExpenseAndIncomeModel,
  Client,
  CreateAccountModel,
  ICreateAccountModel
} from "src/api/client";
import { api } from "src/boot/axios";
import { AccountHistoryModel, AccountModel } from "src/models/account";
import IAccountService from "../interfaces/accountService";

class AccountService implements IAccountService {
  async getAccountHistory(accountId: string, timePeriod: number): Promise<AccountHistoryModel[]> {
    const {
      data: {
        data: { getAccountHistory }
      }
    } = await api.post(`${process.env.API_URL}/graphql`, {
      query: `query {
        getAccountHistory(data: {
          accountId: "${accountId}",
          timePeriod: ${timePeriod}
        }) {
          amount,
          date
        }
      }`
    });
    return getAccountHistory.map((a: any) => ({
      amount: a.amount,
      date: a.date
    }));
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
    } = await api.post(`${process.env.API_URL}/graphql`, {
      query: `query {
        getUserAccounts {
          id,
          name,
          currency,
          balance
        }
      }`
    });
    return getUserAccounts.map((a: any) => ({
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
