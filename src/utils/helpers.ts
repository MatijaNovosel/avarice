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
