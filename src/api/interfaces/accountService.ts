import {
  AccountExpenseAndIncomeModel,
  AccountHistoryModel,
  AccountModel,
  ICreateAccountModel
} from "src/api/client";

export default interface IAccountService {
  getLatestValues(): Promise<AccountModel[]>;
  getExpenseAndIncomeInTimePeriod(accountId: number): Promise<AccountExpenseAndIncomeModel>;
  getAccountHistory(accountId: number, timePeriod: number): Promise<AccountHistoryModel[]>;
  create(payload: ICreateAccountModel): Promise<void>;
}
