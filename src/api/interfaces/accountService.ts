import {
  AccountExpenseIncomeModel,
  AccountHistoryModel,
  AccountModel,
  CreateAccountModel
} from "../../models/account";

export default interface IAccountService {
  getLatestValues(): Promise<AccountModel[]>;
  getExpenseAndIncomeInTimePeriod(
    accountId: string,
    timePeriod: number
  ): Promise<AccountExpenseIncomeModel>;
  getAccountHistory(accountId: string, timePeriod: number): Promise<AccountHistoryModel[]>;
  create(payload: CreateAccountModel): Promise<string>;
}
