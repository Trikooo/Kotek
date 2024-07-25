"use client"

import { Area, AreaChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface WeeklyOrdersProps{
  className?: string
}
export default function WeeklyOrders({className=""}: WeeklyOrdersProps) {
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
        <ChartContainer
          config={{
            orders: {
              label: "Orders",
              color: "hsl(var(--chart-2))",
            },
          }}
        >
          <AreaChart
            accessibilityLayer
            data={[
              {
                week: "2024-01-01",
                orders: 50,
              },
              {
                week: "2024-01-08",
                orders: 60,
              },
              {
                week: "2024-01-15",
                orders: 55,
              },
              {
                week: "2024-01-22",
                orders: 65,
              },
              {
                week: "2024-01-29",
                orders: 70,
              },
              {
                week: "2024-02-05",
                orders: 80,
              },
              {
                week: "2024-02-12",
                orders: 75,
              },
            ]}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="week" hide />
            <YAxis domain={["dataMin - 10", "dataMax + 10"]} hide />
            <defs>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-orders)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-orders)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="orders"
              type="natural"
              fill="url(#fillOrders)"
              fillOpacity={0.4}
              stroke="var(--color-orders)"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value) => (
                <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                  Orders
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {value}
                    <span className="font-normal text-muted-foreground">
                      orders
                    </span>
                  </div>
                </div>
              )}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
