export interface PaymentSourceRecord {
  id: number;
  amount: number;
}

export interface FinancialHistory {
  createdAt: string;
  paymentSources?: PaymentSourceRecord[];
  total: number;
}
