import { IDictionary } from "src/models/common";

export enum TRANSACTION_TYPE {
  TRANSFER = "TRA",
  EXPENSE = "EXP",
  INCOME = "INC"
}

export const TRANSACTION_TYPE_ICON: IDictionary<string> = {
  [TRANSACTION_TYPE.TRANSFER]: "mdi-swap-horizontal",
  [TRANSACTION_TYPE.INCOME]: "mdi-arrow-up",
  [TRANSACTION_TYPE.EXPENSE]: "mdi-arrow-down"
};

export const TRANSACTION_TYPE_COLOR: IDictionary<string> = {
  [TRANSACTION_TYPE.TRANSFER]: "grey",
  [TRANSACTION_TYPE.INCOME]: "green",
  [TRANSACTION_TYPE.EXPENSE]: "red"
};

export const WEEKDAYS = ["Su", "Sa", "Fr", "Th", "We", "Tu", "Mo"];
