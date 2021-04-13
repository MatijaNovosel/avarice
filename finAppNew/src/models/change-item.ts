export interface FinancialChangeItem {
  id: number;
  amount: number;
  createdAt: string;
  description: string;
  expense: boolean;
  transfer: boolean;
  paymentSourceId: number;
  tagIds: number[];
}

export interface CreateFinancialChangeItemDto {
  appUserId: number;
  amount: number;
  description: string | null;
  expense: boolean;
  paymentSourceId: number;
  tagIds: number[];
  createdAt: string;
}

export interface CreateTransferDto {
  appUserId: number;
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