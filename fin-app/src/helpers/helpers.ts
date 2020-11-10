import { PaymentSourceEnum } from "@/constants/payment-source-enum";
import { CategoryEnum } from "@/constants/category-enum";
export function parseCurrency(val: string): number {
  if (val == "" || !val) {
    return 0;
  }
  const formattedString = val.replace("HRK", "").replace(",", ".");
  return parseFloat(formattedString);
}

const categoryTranslation = {
  [CategoryEnum.Food]: "Hrana",
  [CategoryEnum.Games]: "Igre",
  [CategoryEnum.Gifts]: "Darovi",
  [CategoryEnum.PublicTransport]: "Javni prijevoz"
};

export function formatCategory(val: CategoryEnum): string {
  return categoryTranslation[val];
}

const paymentSourceTranslation = {
  [PaymentSourceEnum.CheckingAccount]: "Tekući račun",
  [PaymentSourceEnum.GyroAccount]: "Žiro račun",
  [PaymentSourceEnum.Pocket]: "Džep"
};

export function formatPaymentSource(val: PaymentSourceEnum): string {
  return paymentSourceTranslation[val];
}
