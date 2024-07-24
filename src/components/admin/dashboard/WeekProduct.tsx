"use client";

import { Bar, BarChart, Rectangle, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
interface WeekProductProps{
  className?: string
}
export default function WeekProduct({ className = ""}: WeekProductProps) {
  return (
    <Card className={`${className}`}>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Weekly Product Sales</CardTitle>
        <CardDescription>
          Units sold for different products over the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
        <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
          150
          <span className="text-sm font-normal text-muted-foreground">
            units/day
          </span>
        </div>
        <ChartContainer
          config={{
            sales: {
              label: "Units Sold",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="ml-auto w-[72px]"
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            data={[
              {
                date: "2024-07-18",
                sales: 120,
                product: "MSI Motherboard",
              },
              {
                date: "2024-07-19",
                sales: 150,
                product: "Intel CPU",
              },
              {
                date: "2024-07-20",
                sales: 180,
                product: "Corsair Cooler",
              },
              {
                date: "2024-07-21",
                sales: 130,
                product: "ASUS Monitor",
              },
              {
                date: "2024-07-22",
                sales: 170,
                product: "NVIDIA GPU",
              },
              {
                date: "2024-07-23",
                sales: 160,
                product: "Corsair Cooler",
              },
              {
                date: "2024-07-24",
                sales: 140,
                product: "Intel CPU",
              },
            ]}
          >
            <Bar
              dataKey="sales"
              fill="hsl(var(--chart-1))"
              radius={2}
              fillOpacity={0.2}
              activeIndex={6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              hide
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
