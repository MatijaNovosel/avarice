import { api } from "@/configurations/axios";
import {
  AccountExpenseIncomeModel,
  AccountHistoryModel,
  AccountModel,
  CreateAccountModel
} from "../../models/account";
import IAccountService from "../interfaces/accountService";

class AccountService implements IAccountService {
  async getAccountHistory(accountId: string, timePeriod: number): Promise<AccountHistoryModel[]> {
    const {
      data: {
        data: { getAccountHistory }
      }
    } = await api.post("", {
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
    } = await api.post("", {
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
    } = await api.post("", {
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

  async create({ initialBalance, name }: CreateAccountModel): Promise<string> {
    const {
      data: {
        data: { createAccount }
      }
    } = await api.post("", {
      query: `mutation {
        createAccount(data: {
          name: "${name}",
          currency: "EUR",
          initialBalance: ${initialBalance}
        })
      }`
    });
    return createAccount;
  }

  async delete(id: string): Promise<string> {
    const {
      data: {
        data: { deleteAccount }
      }
    } = await api.post("", {
      query: `mutation {
        deleteAccount(data: {
          id: "${id}"
        })
      }`
    });
    return deleteAccount;
  }
}

export default AccountService;
