import { AccountModel, AccountExpenseAndIncomeModel } from "src/api/client";

export default interface IAccountService {
  getLatestValues(): Promise<AccountModel[]>;
  getExpenseAndIncomeInTimePeriod(accountId: number): Promise<AccountExpenseAndIncomeModel>;
}
