import {
  File,
  ListFilter,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Column, DataTable, Row } from "@/components/dynamic-ui/DataTable";

interface OrderListProps {
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

export default function OrderList({ className = "" }: OrderListProps) {
  return(
    <Tabs defaultValue="week">
    <div className="flex items-center">
      <TabsList>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
        <TabsTrigger value="year">Year</TabsTrigger>
      </TabsList>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-sm"
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              Fulfilled
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Declined
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Refunded
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 text-sm"
        >
          <File className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Export</span>
        </Button>
      </div>
    </div>
    <TabsContent value="week">
    <DataTable
              title="Orders"
              description="Orders from this week."
              columns={columns}
              rows={rows}
            />
    </TabsContent>
  </Tabs>
  )
};
