"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dynamic-ui/DataTable";

interface NewCustomersProps {
  className?: string;
}

// Updated headers to use Column object with `important` flag
const columns = [
  { header: "Customer", important: true }, // Important column to show on small screens
  { header: "Origin", important: true },
];

const rows = [
  {
    customer: "Liam Johnson",
    email: "liam@example.com",
    origin: "Facebook",
  },
  {
    customer: "Olivia Smith",
    email: "olivia@example.com",
    origin: "Ouedkniss",
  },
  {
    customer: "Noah Williams",
    email: "noah@example.com",
    origin: "Website",
  },
  {
    customer: "Emma Brown",
    email: "emma@example.com",
    origin: "In Store",
  },
  {
    customer: "Liam Johnson",
    email: "liam@example.com",
    origin: "Other",
  },
];

export default function NewCustomers({ className = "" }: NewCustomersProps) {
  return (
    <DataTable
      title="Recent Customers"
      description="Overview of recent customer orders and their sources."
      columns={columns} // Updated to use columns instead of headers
      rows={rows}
      className={className}
      actions={
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      }
      currentPage={0}
      totalPages={0}
      setPage={() => {
        console.log("");
      }}
    />
  );
}
