export interface Transaction {
  id: number;
  amount: number;
  account: string;
  description: string;
  category: string;
  expense: boolean;
  date: string;
}
