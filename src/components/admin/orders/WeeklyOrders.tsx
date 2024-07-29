// WeeklyOrders.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DynamicAreaChart from "@/components/dynamic-ui/DynamicAreaChart";

interface WeeklyOrdersProps {
  className?: string;
}

export default function WeeklyOrders({ className = "" }: WeeklyOrdersProps) {
  const chartData = [
    { week: "2024-01-01", orders: 50 },
    { week: "2024-01-08", orders: 60 },
    { week: "2024-01-15", orders: 55 },
    { week: "2024-01-22", orders: 65 },
    { week: "2024-01-29", orders: 70 },
    { week: "2024-02-05", orders: 80 },
    { week: "2024-02-12", orders: 75 },
  ];

  const chartConfig = {
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card className={className}>
      <CardHeader className="space-y-0 pb-0">
        <CardDescription>Orders per Week</CardDescription>
        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
          56
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            orders
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DynamicAreaChart data={chartData} config={chartConfig} />
      </CardContent>
    </Card>
  );
}
