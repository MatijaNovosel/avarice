import { Client, CreateAccountModel, ICreateAccountModel } from "src/api/client";
import { api } from "src/boot/axios";
import { AccountExpenseIncomeModel, AccountHistoryModel, AccountModel } from "../../models/account";
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
      date: new Date(a.date)
    }));
  }

  async getExpenseAndIncomeInTimePeriod(
    accountId: string,
    timePeriod: number
  ): Promise<AccountExpenseIncomeModel> {
    const {
      data: {
        data: { getExpenseAndIncomeInTimePeriod }
      }
    } = await api.post(`${process.env.API_URL}/graphql`, {
      query: `query {
        getExpenseAndIncomeInTimePeriod(data: {
          accountId: "${accountId}",
          timePeriod: ${timePeriod}
        }) {
          expense,
          income
        }
      }`
    });

    return {
      expense: getExpenseAndIncomeInTimePeriod.expense,
      income: getExpenseAndIncomeInTimePeriod.income
    };
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
