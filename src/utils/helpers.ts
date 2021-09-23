export function sample<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function formatBalance(balance: number | undefined, currency: string | undefined) {
  if (balance !== undefined && currency !== undefined) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency
    }).format(balance);
  }
  return "";
}

export function acronym(txt: string) {
  return txt
    .split(" ")
    .map((item) => item[0])
    .join("");
}

export function randInt(start: number, end: number) {
  const min = Math.ceil(start);
  const max = Math.floor(end);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
