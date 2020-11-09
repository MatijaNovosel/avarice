export function parseCurrency(val: string): number {
  if (val == "" || !val) {
    return 0;
  }
  const formattedString = val.replace("HRK", "").replace(",", ".");
  return parseFloat(formattedString);
}
