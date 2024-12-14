export function formatCurrency(
  amount: number,
  currencySuffix: boolean = true
): string {
  const formattedAmount = amount
    .toLocaleString("en-US", { useGrouping: true })
    .replace(/,/g, " ");

  return currencySuffix ? `${formattedAmount} DA` : formattedAmount;
}
