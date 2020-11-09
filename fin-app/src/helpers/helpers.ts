export function parseCurrency(val: string): number {
  const formattedString = val.replace("HRK", "").replace(",", ".");
  return parseFloat(formattedString);
}
