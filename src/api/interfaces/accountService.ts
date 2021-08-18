import { Account, AccountExpenseAndIncomeModel } from "src/api/client";

export default interface IAccountService {
  getLatestValues(): Promise<Account[]>;
  getExpenseAndIncomeInTimePeriod(accountId: number): Promise<AccountExpenseAndIncomeModel>;
}
