import { Account, Client } from "src/api/client";
import { api } from "src/boot/axios";
import CONSTANTS from "src/utils/constants";
import IAccountService from "../interfaces/accountService";

class AccountService implements IAccountService {
  async getLatestValues(): Promise<Account[]> {
    const client = new Client(CONSTANTS.API_URL, api);
    const data = await client.account_GetUserAccounts();
    return data;
  }
}

export default AccountService;
