import { SelectItem } from "@/models/select-item";
import { useI18n } from "vue-i18n";
import { Color } from "./color";
import Solver from "./solver";

/**
 * Converts a hexadecimal color string to a rgb color string.
 * @param {string} hex Hex string.
 * @returns {(null|Array)} RGB values in an array.
 */
export function hexToRgb(hex: string): number[] | null {
  if (hex == "") {
    return [0, 0, 0];
  }

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

export function randomHexColor(): string {
  return "#000000".replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
}

interface EnumObjectArrayItem {
  id: number;
  name: string;
}

export function enumToObjectArray<T>(enumeration: T): EnumObjectArrayItem[] {
  return Object.entries(enumeration)
    .filter(e => !isNaN(parseInt(e[0])))
    .map(e => ({ name: e[1], id: parseInt(e[0]) }));
}

export function createSelectFromEnum<T>(
  translationPrefix: string,
  enumType: T
) {
  const objectTypes: SelectItem<number>[] = [];
  const { t } = useI18n();

  const enumObjectArray = enumToObjectArray<T>(enumType);

  enumObjectArray
    .map(x => x.name)
    .forEach((name: string) => {
      objectTypes.push({
        text: String(t(translationPrefix + "." + name)),
        val: enumObjectArray.filter(x => x.name == name)[0].id
      });
    });

  return objectTypes;
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

/**
 * Sets all properties of an object to a specific value.
 * @param {Object} obj Object reference.
 * @param {any} val Value of properties.
 */
// eslint-disable-next-line
export function setAllPropertiesToVal(obj: Record<string, any>, val: any) {
  Object.keys(obj).forEach(index => (obj[index] = val));
}
