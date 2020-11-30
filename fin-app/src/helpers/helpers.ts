import { stringFormatCollection } from "./../constants/string-format-collection";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";
import { CategoryEnum } from "@/constants/category-enum";
import { SelectItem } from "@/constants/select-item";
import { IndexableCollectionByString } from "@/constants/indexable-collection-by-string";
import { Color, HSL } from "./color";

interface Loss {
  loss: number;
  values?: number[];
}

interface SolveResult {
  values: number[];
  loss: number;
  filter: string;
}

class Solver {
  private target: Color;
  private targetHSL: HSL;
  private reusedColor: Color;

  constructor(target: Color) {
    this.target = target;
    this.targetHSL = target.hsl();
    this.reusedColor = new Color(0, 0, 0);
  }

  solve(): SolveResult {
    const result = this.solveNarrow(this.solveWide());
    return {
      values: result.values as number[],
      loss: result.loss,
      filter: this.css(result.values as number[])
    };
  }

  solveWide(): Loss {
    const A = 5;
    const c = 15;
    const a = [60, 180, 18000, 600, 1.2, 1.2];

    let best = { loss: Infinity };
    for (let i = 0; best.loss > 25 && i < 3; i++) {
      const initial = [50, 20, 3750, 50, 100, 100];
      const result = this.spsa(A, a, c, initial, 1000);
      if (result.loss < best.loss) {
        best = result;
      }
    }
    return best;
  }

  solveNarrow(wide: Loss) {
    const A = wide.loss;
    const c = 2;
    const A1 = A + 1;
    const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
    return this.spsa(A, a, c, wide.values as number[], 500);
  }

  fix(value: number, idx: number) {
    let max = 100;
    if (idx === 2) {
      max = 7500;
    } else if (idx === 4 || idx === 5) {
      max = 200;
    }

    if (idx === 3) {
      if (value > max) {
        value %= max;
      } else if (value < 0) {
        value = max + (value % max);
      }
    } else if (value < 0) {
      value = 0;
    } else if (value > max) {
      value = max;
    }
    return value;
  }

  spsa(A: number, a: number[], c: number, values: number[], iters: number) {
    const alpha = 1;
    const gamma = 0.16666666666666666;

    let best = null;
    let bestLoss = Infinity;
    const deltas = new Array(6);
    const highArgs = new Array(6);
    const lowArgs = new Array(6);

    for (let k = 0; k < iters; k++) {
      const ck = c / Math.pow(k + 1, gamma);
      for (let i = 0; i < 6; i++) {
        deltas[i] = Math.random() > 0.5 ? 1 : -1;
        highArgs[i] = values[i] + ck * deltas[i];
        lowArgs[i] = values[i] - ck * deltas[i];
      }

      const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
      for (let i = 0; i < 6; i++) {
        const g = (lossDiff / (2 * ck)) * deltas[i];
        const ak = a[i] / Math.pow(A + k + 1, alpha);
        values[i] = this.fix(values[i] - ak * g, i);
      }

      const loss = this.loss(values);
      if (loss < bestLoss) {
        best = values.slice(0);
        bestLoss = loss;
      }
    }
    return { values: best, loss: bestLoss };
  }

  loss(filters: number[]) {
    const color = this.reusedColor;
    color.set(0, 0, 0);

    color.invert(filters[0] / 100);
    color.sepia(filters[1] / 100);
    color.saturate(filters[2] / 100);
    color.hueRotate(filters[3] * 3.6);
    color.brightness(filters[4] / 100);
    color.contrast(filters[5] / 100);

    const colorHSL = color.hsl();

    return (
      Math.abs((color.r as number) - (this.target.r as number)) +
      Math.abs((color.g as number) - (this.target.g as number)) +
      Math.abs((color.b as number) - (this.target.b as number)) +
      Math.abs(colorHSL.h - this.targetHSL.h) +
      Math.abs(colorHSL.s - this.targetHSL.s) +
      Math.abs(colorHSL.l - this.targetHSL.l)
    );
  }

  css(filters: number[]): string {
    function fmt(idx: number, multiplier = 1) {
      return Math.round(filters[idx] * multiplier);
    }
    return `invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(
      2
    )}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(
      5
    )}%)`;
  }
}

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
