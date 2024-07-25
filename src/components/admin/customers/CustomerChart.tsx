"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

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
  { source: "facebook", customers: 275, fill: "hsl(var(--chart-1))" },
  { source: "ouedkniss", customers: 200, fill: "hsl(var(--chart-2))" },
  { source: "website", customers: 187, fill: "hsl(var(--chart-3))" },
  { source: "in store", customers: 173, fill: "hsl(var(--chart-4))" },
  { source: "other", customers: 90, fill: "hsl(var(--chart-5))" },
]

const chartConfig = {
  customers: {
    label: "Customers",
  },
  facebook: {
    label: "Facebook",
    color: "hsl(var(--chart-1))",
  },
  ouedkniss: {
    label: "Ouedkniss",
    color: "hsl(var(--chart-2))",
  },
  website: {
    label: "Website",
    color: "hsl(var(--chart-3))",
  },
  "in store": {
    label: "In Store",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function CustomerChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Customer Origin</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="customers" hideLabel />}
            />
            <Pie data={chartData} dataKey="customers">
              <LabelList
                dataKey="source"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
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
          Showing total customers for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
