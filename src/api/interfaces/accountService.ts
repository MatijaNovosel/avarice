import {
  AccountModel,
  AccountExpenseAndIncomeModel,
  AccountHistoryModel,
  ICreateAccountModel
} from "src/api/client";

export default interface IAccountService {
  getLatestValues(): Promise<AccountModel[]>;
  getExpenseAndIncomeInTimePeriod(accountId: number): Promise<AccountExpenseAndIncomeModel>;
  getAccountHistory(accountId: number): Promise<AccountHistoryModel[]>;
  create(payload: ICreateAccountModel): Promise<void>;
}
