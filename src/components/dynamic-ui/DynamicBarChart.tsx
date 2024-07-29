import { BarChart, Bar, XAxis, Rectangle } from 'recharts'; // Ensure 'recharts' is installed
import { ChartContainer } from '../ui/chart';

interface ChartData {
  date: string;
  [key: string]: any; // Allows for any additional data fields
}

interface DynamicBarChartProps {
  data: ChartData[];
  dataKey: string; // The key in the data to visualize
  label: string;   // Label for the chart
  color?: string;  // Optional color override
}

function DynamicBarChart({ data, dataKey, label, color }: DynamicBarChartProps) {
  return (
    <ChartContainer
      config={{
        [dataKey]: {
          label: label,
          color: color || "hsl(var(--chart-1))",
        },
      }}
      className="ml-auto w-[72px]"
    >
      <BarChart
        accessibilityLayer
        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        data={data}
      >
        <Bar
          dataKey={dataKey}
          fill={color || "hsl(var(--chart-1))"}
          radius={2}
          fillOpacity={0.2}
          activeIndex={data.length - 1} // Last bar as active
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
  );
}

export default DynamicBarChart;
