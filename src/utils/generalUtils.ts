export function formatCurrency(amount: number): string {
  return (
    amount.toLocaleString("en-US", { useGrouping: true }).replace(/,/g, " ") +
    " DA"
  );
}
