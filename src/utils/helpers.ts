import { ErrorObject } from "@vuelidate/core";

export const formatBalance = (balance: number | undefined, currency: string | undefined) => {
  if (balance !== undefined && currency !== undefined) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency
    }).format(balance);
  }
  return "";
};

export const formatNumericValue = (val: number | undefined) => {
  if (val !== undefined) {
    return new Intl.NumberFormat().format(val);
  }
  return "";
};

export const collectErrors = (errors: ErrorObject[]) => {
  return errors.map((error) => error.$message).join("");
};
