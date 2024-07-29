"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DynamicBarChart from "@/components/dynamic-ui/DynamicBarChart";

const data = [
  { date: "2024-07-18", sales: 120, profit: 50 },
  { date: "2024-07-19", sales: 150, profit: 70 },
  { date: "2024-07-20", sales: 390, profit: 130 },
  { date: "2024-07-21", sales: 130, profit: 40 },
  { date: "2024-07-22", sales: 170, profit: 80 },
  { date: "2024-07-23", sales: 160, profit: 60 },
  { date: "2024-07-24", sales: 140, profit: 55 },
];

interface WeeklyProductSalesProps {
  className?: string;
}
export default function WeeklyProductSales({
  className = "",
}: WeeklyProductSalesProps) {
  return (
    <Card className={`${className} flex flex-col justify-between`}>
      <CardHeader className="p-4 pt-6">
        <CardTitle>Weekly Product Sales</CardTitle>
        <CardDescription>
          Units sold for different products over the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pb-5">
        <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
          150
          <span className="text-sm font-normal text-muted-foreground">
            units/day
          </span>
        </div>
        <DynamicBarChart
          data={data}
          dataKey="profit"
          label="Profit"
          color="hsl(var(--chart-2))"
        />
      </CardContent>
    </Card>
  );
}
