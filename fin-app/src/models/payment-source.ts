export interface PaymentSource {
  id: number;
  description: string;
  currency: string;
  icon: string;
  currentAmount?: number;
  visible?: boolean;
}

export interface AccountLatestValue {
  description: string;
  currency: string;
  icon: string;
  amount?: number;
}
