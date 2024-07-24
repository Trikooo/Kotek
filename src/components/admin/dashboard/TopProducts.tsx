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
const chartData = [
  { product: "MSI Z490-A PRO Motherboard", sales: 120, fill: "hsl(var(--chart-1))" },
  { product: "Intel Core i5-11600K CPU", sales: 200, fill: "hsl(var(--chart-2))" },
  { product: "Corsair Hydro Series H100i Water Cooler", sales: 90, fill: "hsl(var(--chart-3))" },
  { product: "ASUS ROG Swift PG27UQ 4K Monitor", sales: 150, fill: "hsl(var(--chart-4))" },
  { product: "NVIDIA GeForce RTX 3070 Graphics Card", sales: 250, fill: "hsl(var(--chart-5))" },
];



const chartConfig = {
  sales: {
    label: "Sales",
  },
  msiMotherboard: {
    label: "MSI Z490-A PRO Motherboard",
    color: "hsl(var(--chart-1))",
  },
  intelCpu: {
    label: "Intel Core i5-11600K CPU",
    color: "hsl(var(--chart-2))",
  },
  corsairCooler: {
    label: "Corsair Hydro Series H100i Water Cooler",
    color: "hsl(var(--chart-3))",
  },
  asusMonitor: {
    label: "ASUS ROG Swift PG27UQ 4K Monitor",
    color: "hsl(var(--chart-4))",
  },
  nvidiaGpu: {
    label: "NVIDIA GeForce RTX 3070 Graphics Card",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;


export function TopProducts() {
  const totalSales = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.sales, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Products Sales</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="sales"
              nameKey="product"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalSales.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Sales
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}