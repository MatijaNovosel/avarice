import { AccountModel, AccountExpenseAndIncomeModel, Client } from "src/api/client";
import { api } from "src/boot/axios";
import CONSTANTS from "src/utils/constants";
import IAccountService from "../interfaces/accountService";

class AccountService implements IAccountService {
  async getExpenseAndIncomeInTimePeriod(accountId: number): Promise<AccountExpenseAndIncomeModel> {
    const client = new Client(CONSTANTS.API_URL, api);
    const data = await client.account_GetExpenseAndIncomeInTimePeriod(accountId);
    return data;
  }
  async getLatestValues(): Promise<AccountModel[]> {
    const client = new Client(CONSTANTS.API_URL, api);
    const data = await client.account_GetUserAccounts();
    return data;
  }
}

export default AccountService;
