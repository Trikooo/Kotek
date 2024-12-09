"use client";

import { DataTable, Column, Row } from "@/components/dynamic-ui/DataTable"; // Adjust the import path as necessary

interface RecentOrdersProps {
  className?: string;
}

const columns: Column[] = [
  { header: "Customer", important: true, hasSecondaryData: true }, // Indicate secondary data for Customer
  { header: "Type" },
  { header: "Status", badge: true },
  { header: "Date" },
  { header: "Amount", important: true },
];

const rows: Row[] = [
  {
    id: 1,
    customer: {
      primary: "Liam Johnson",
      secondary: "liam@example.com",
    },
    type: "Sale",
    status: { value: "Fulfilled", filled: true },
    date: "2023-06-23",
    amount: "$250.00",
  },
  {
    id: 1,
    customer: {
      primary: "Olivia Smith",
      secondary: "olivia@example.com",
    },
    type: "Refund",
    status: { value: "Declined", filled: false },
    date: "2023-06-24",
    amount: "$150.00",
  },
  {
    id: 1,
    customer: {
      primary: "Noah Williams",
      secondary: "noah@example.com",
    },
    type: "Subscription",
    status: { value: "Fulfilled", filled: true },
    date: "2023-06-25",
    amount: "$350.00",
  },
  {
    id: 1,
    customer: {
      primary: "Emma Brown",
      secondary: "emma@example.com",
    },
    type: "Sale",
    status: { value: "Fulfilled", filled: true },
    date: "2023-06-26",
    amount: "$450.00",
  },
];

export default function RecentOrders({ className = "" }: RecentOrdersProps) {
  return (
    <DataTable
      title="Recent Orders"
      description="Recent orders from your store."
      columns={columns}
      rows={rows}
      className={className}
      currentPage={0}
      totalPages={0}
      setPage={() => {
        console.log("");
      }}
    />
  );
}
