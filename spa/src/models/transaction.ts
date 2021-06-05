export interface Transaction {
  id: number;
  amount: number;
  createdAt: string;
  description: string;
  expense: boolean;
  transfer: boolean;
  accountId: number;
  tagIds: number[];
}

export interface AddTransactionDto {
  userId: string;
  amount: number;
  description: string | null;
  expense: boolean;
  accountId: number;
  tagIds: number[];
  createdAt: string;
}

export interface CreateTransferDto {
  userId: string;
  amount: number;
  accountFromId: number;
  accountToId: number;
}

export interface TransactionAmountRange {
  min: number | null;
  max: number | null;
}

export interface RecentDepositsAndWithdrawals {
  withdrawals: number;
  deposits: number;
}

export interface DailyChange {
  withdrawals: number;
  deposits: number;
  createdAt: Date;
}

export interface DailyChangeDto {
  withdrawals: number;
  deposits: number;
  createdAt: string;
}

export interface LatestDate {
  latestDate: string;
}