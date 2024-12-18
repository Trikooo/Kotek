import { v4 as uuidv4 } from "uuid";

export function formatCurrency(
  amount: number,
  currencySuffix: boolean = true
): string {
  const formattedAmount = amount
    .toLocaleString("en-US", { useGrouping: true })
    .replace(/,/g, " ");

  return currencySuffix ? `${formattedAmount} DA` : formattedAmount;
}

export function generateKey(prefix: string): string {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date
    .getHours()
    .toString()
    .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  const uuid = uuidv4();
  return `${prefix}/${formattedDate}-${uuid}`;
}
