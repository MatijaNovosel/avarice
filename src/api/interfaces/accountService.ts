import { ICreateAccountModel } from "src/api/client";
import { AccountExpenseIncomeModel, AccountHistoryModel, AccountModel } from "../../models/account";

export default interface IAccountService {
  getLatestValues(): Promise<AccountModel[]>;
  getExpenseAndIncomeInTimePeriod(
    accountId: string,
    timePeriod: number
  ): Promise<AccountExpenseIncomeModel>;
  getAccountHistory(accountId: string, timePeriod: number): Promise<AccountHistoryModel[]>;
  create(payload: ICreateAccountModel): Promise<void>;
}
