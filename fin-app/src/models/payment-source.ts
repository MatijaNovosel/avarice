export interface PaymentSource {
  id: number;
  description: string;
  currency: string;
  icon: string;
  currentAmount?: number;
}
