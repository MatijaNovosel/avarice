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
  [CategoryEnum.PublicTransport]: "Javni prijevoz",
  [CategoryEnum.Other]: "Ostalo"
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

export function hexToRGBA(hex: string, opacity: number): string {
  const hexFixed: string = hex.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (m, r, g, b) => "#" + r + r + g + g + b + b
  );
  const matchResult = hexFixed.match(/.{2}/g);

  if (matchResult != null) {
    const res: number[] = matchResult.map(x => parseInt(x, 16)) as number[];
    return `rgba(${res.join(", ")}, ${opacity})`;
  } else {
    return `rgba(255, 255, 255, 1)`;
  }
}
