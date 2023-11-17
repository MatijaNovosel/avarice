import {
  AccountExpenseAndIncomeModel,
  AccountHistoryModel,
  ICreateAccountModel
} from "src/api/client";
import { AccountModel } from "src/models/account";

export default interface IAccountService {
  getLatestValues(): Promise<AccountModel[]>;
  getExpenseAndIncomeInTimePeriod(accountId: number): Promise<AccountExpenseAndIncomeModel>;
  getAccountHistory(accountId: number, timePeriod: number): Promise<AccountHistoryModel[]>;
  create(payload: ICreateAccountModel): Promise<void>;
}
