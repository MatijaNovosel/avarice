/* eslint-disable */
import { SelectItem } from "@/models/select-item";
import { useI18n } from "vue-i18n";
import { Color } from "./color";
import Solver from "./solver";

/**
 * Converts a hexadecimal color string to a rgb color string.
 * @param {string} hex Hex string.
 * @returns {(number[]|null)} RGB values in an array.
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

/**
 * Converts a hex color string to an rgba(r, g, b, a) color string.
 * @param {string} hex Hex color string.
 * @param {number} opacity Opacity of rgba color string.
 * @returns {(string | null)} Converted rgba color string.
 */
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

/**
 * Generates a random hex color string.
 * @returns {string} Generated random hex color string.
 */
export function randomHexColor(): string {
  return "#000000".replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
}

interface EnumObjectItem {
  id: number;
  name: string;
}

/**
 * Creates an array of objects with keys and values of a supplied enumeration.
 * @param {any} enumeration Supplied enumeration.
 * @returns {EnumObjectItem[]} Created object array.
 */
export function enumToObjectArray<T>(enumeration: T): EnumObjectItem[] {
  return Object.entries(enumeration)
    .filter(e => !isNaN(parseInt(e[0])))
    .map(e => ({ name: e[1], id: parseInt(e[0]) }));
}

/**
 * Creates an array of select items from an enumeration that can be used in a select element.
 * @param {string} translationPrefix String to be used while getting translation values of the supplied enumeration.
 * @param {any} enumType Supplied enumeration.
 * @example
 * enum TagEnum {
 *  Games = 1,
 *  Gifts = 2
 * }
 * const tags = createSelectFromEnum("tags", TagEnum);
 * @returns {SelectItem[]} Created select item array.
 */
export function createSelectFromEnum<T>(
  translationPrefix: string,
  enumType: T
) {
  const selectItems: SelectItem<number>[] = [];
  const { t } = useI18n();

  const enumObjectArray = enumToObjectArray<T>(enumType);

  enumObjectArray
    .map(x => x.name)
    .forEach((name: string) => {
      selectItems.push({
        text: String(t(translationPrefix + "." + name)),
        val: enumObjectArray.filter(x => x.name == name)[0].id
      });
    });

  return selectItems;
}

/**
 * Converts a hex color string into a css filter.
 * @param {string} hex Hexadecimal color string.
 * @returns {string} CSS filter string.
 */
export function hexToCssFilter(hex: string): string {
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
export function setAllPropertiesToVal(
  obj: Record<string, any>,
  val: any
): void {
  Object.keys(obj).forEach(index => (obj[index] = val));
}

/**
 * Debounces the calling of a specified function for a set amount of miliseconds.
 * @param {T} callback Function to debounce.
 * @param {number} waitFor Amount of time before the function is called.
 * @example 
 * function test(message) {
    alert(message);
  }

  const debouncedTest = debounce(test, 2000);
 */
export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  waitFor: number
) => {
  let timeout = 0;
  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      result = callback(...args);
    }, waitFor);
    return result;
  };
};
