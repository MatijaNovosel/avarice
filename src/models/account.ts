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
