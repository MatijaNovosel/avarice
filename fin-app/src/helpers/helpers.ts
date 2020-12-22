import { stringFormatCollection } from "./../constants/string-format-collection";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";
import { TagEnum } from "@/constants/tag-enum";
import { SelectItem } from "@/constants/select-item";
import { IndexableCollectionByString } from "@/constants/indexable-collection-by-string";
import { Color } from "./color";
import Solver from "./solver";

/**
 * Converts a hexadecimal color string to a rgb color string.
 * @param {string} hex Hex string.
 * @returns {(null|Array)} RGB values in an array.
 */
export function hexToRgb(hex: string): number[] | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : null;
}

export function hexToRgba(hex: string, opacity = 0.2): string | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, ${opacity})`
    : null;
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

export function hexToCssFilter(hex: string) {
  const rgb = hexToRgb(hex);
  const color = new Color(
    (rgb as number[])[0],
    (rgb as number[])[1],
    (rgb as number[])[2]
  );
  const solver = new Solver(color);
  return solver.solve().filter;
}

export function formatTag(val: TagEnum): string {
  return stringFormatCollection["tag"][TagEnum[val]];
}

export function formatPaymentSource(val: PaymentSourceEnum): string {
  return stringFormatCollection["paymentSource"][PaymentSourceEnum[val]];
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

/**
 * Sets all properties of an object to a specific value.
 * @param {Object} obj Object reference.
 * @param {any} val Value of properties.
 */
export function setAllPropertiesToVal(obj: Record<string, any>, val: any) {
  Object.keys(obj).forEach(index => (obj[index] = val));
}
