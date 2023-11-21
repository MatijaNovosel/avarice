export interface AccountModel {
  id: string;
  name: string;
  currency: string;
  balance: number;
}

export interface AccountHistoryModel {
  date: Date;
  amount: number;
}

export interface AccountExpenseIncomeModel {
  expense: number;
  income: number;
}

export interface CreateAccountModel {
  name: string;
  initialBalance: number;
}
