// DynamicAreaChart.tsx
"use client"

import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface DynamicAreaChartProps {
  data: Array<{ week: string, orders: number }>;
  config: any;
}

export default function DynamicAreaChart({ data, config }: DynamicAreaChartProps) {
  return (
    <ChartContainer config={config}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
      >
        <XAxis dataKey="week" hide />
        <YAxis domain={["dataMin - 10", "dataMax + 10"]} hide />
        <defs>
          <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-orders)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-orders)" stopOpacity={0.1} />
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
                <span className="font-normal text-muted-foreground">orders</span>
              </div>
            </div>
          )}
        />
      </AreaChart>
    </ChartContainer>
  );
}
