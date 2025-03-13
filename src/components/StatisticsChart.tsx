
import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatisticsChartProps {
  data: Array<{
    name: string;
    value: number;
    maxValue?: number;
    color?: string;
  }>;
  title: string;
  description?: string;
  className?: string;
}

export function StatisticsChart({ 
  data, 
  title, 
  description, 
  className 
}: StatisticsChartProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Client-side only rendering for charts to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Set default colors if not provided
  const chartData = data.map(item => ({
    ...item,
    color: item.color || "#3B82F6",
    maxValue: item.maxValue || 100
  }));
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded-md shadow-md border border-gray-100 text-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-gray-700">{`Value: ${data.value}`}</p>
          {data.maxValue && (
            <p className="text-gray-500 text-xs">{`Max: ${data.maxValue}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full">
          {isClient && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                  domain={[0, 'dataMax']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
