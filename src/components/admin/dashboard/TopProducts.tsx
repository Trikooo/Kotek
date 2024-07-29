"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import DynamicPieChart from "@/components/dynamic-ui/DynamicPieChart"
const chartData = [
  { product: "NVIDIA GeForce RTX 4080", sales: 500, fill: "var(--color-rtx-4080)" },
  { product: "Apple MacBook Pro M2", sales: 350, fill: "var(--color-macbook-pro-m2)" },
  { product: "Dell XPS 15", sales: 420, fill: "var(--color-dell-xps-15)" },
  { product: "ASUS ROG Strix", sales: 300, fill: "var(--color-asus-rog)" },
  { product: "Logitech MX Master 3", sales: 150, fill: "var(--color-logitech-mx-master-3)" },
];

const chartConfig = {
  sales: {
    label: "Sales",
  },
  "rtx-4080": {
    label: "NVIDIA GeForce RTX 4080",
    color: "hsl(var(--chart-1))",
  },
  "macbook-pro-m2": {
    label: "Apple MacBook Pro M2",
    color: "hsl(var(--chart-2))",
  },
  "dell-xps-15": {
    label: "Dell XPS 15",
    color: "hsl(var(--chart-3))",
  },
  "asus-rog": {
    label: "ASUS ROG Strix",
    color: "hsl(var(--chart-4))",
  },
  "logitech-mx-master-3": {
    label: "Logitech MX Master 3",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;


export default function TopProducts() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.sales, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Products</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <DynamicPieChart chartConfig={chartConfig} chartData={chartData} dataKey="sales" nameKey="product" total={totalVisitors}/>
       </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
