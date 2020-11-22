import { stringFormatCollection } from "./../constants/string-format-collection";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";
import { CategoryEnum } from "@/constants/category-enum";
import { SelectItem } from "@/constants/select-item";
import { IndexableCollectionByString } from "@/constants/indexable-collection-by-string";

export function parseCurrency(val: string): number {
  if (val == "" || !val) {
    return 0;
  }
  const formattedString = val.replace("HRK", "").replace(",", ".");
  return parseFloat(formattedString);
}

export function formatCategory(val: CategoryEnum): string {
  return stringFormatCollection["category"][CategoryEnum[val]];
}

export function formatPaymentSource(val: PaymentSourceEnum): string {
  return stringFormatCollection["paymentSource"][PaymentSourceEnum[val]];
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

export function adjustHexColor(color: string, amount: number): string {
  return color
    .replace(/^#/, "")
    .replace(/../g, color =>
      (
        "0" +
        Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
      ).substr(-2)
    );
}

export function createSelectFromEnum<T extends IndexableCollectionByString>(
  inVal: T,
  formatKey: string
): SelectItem<T>[] {
  const returnVal: SelectItem<T>[] = [];
  const names = Object.keys(inVal).filter(x => isNaN(Number(x)));
  names.forEach(x => {
    returnVal.push({
      text: stringFormatCollection[formatKey][x],
      val: inVal[x]
    });
  });

  return returnVal;
}
