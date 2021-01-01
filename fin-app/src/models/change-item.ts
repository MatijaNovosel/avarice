export interface FinancialChangeItem {
  id: number;
  amount: number;
  createdAt: string;
  description: string;
  expense: boolean;
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
}
