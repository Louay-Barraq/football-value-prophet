
import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatisticsChartProps {
  data: Array<{
    season?: string;
    name?: string;
    value?: number;
    goals?: number;
    assists?: number;
    appearances?: number;
    maxValue?: number;
    color?: string;
  }>;
  title?: string;
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
  
  // Process the data for the chart
  const processedData = data.map(item => {
    // If the data is already in the name/value format
    if (item.name && item.value !== undefined) {
      return {
        ...item,
        color: item.color || "#3B82F6",
        maxValue: item.maxValue || 100
      };
    }
    
    // If the data is in the season/goals/assists format (from player statistics)
    return {
      name: item.season || "",
      value: item.goals || 0,
      color: "#3B82F6",
      maxValue: 30, // Default max value for goals chart
      goals: item.goals || 0,
      assists: item.assists || 0,
      appearances: item.appearances || 0
    };
  });
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded-md shadow-md border border-gray-100 text-sm">
          <p className="font-medium">{data.name}</p>
          {data.goals !== undefined && <p className="text-gray-700">{`Goals: ${data.goals}`}</p>}
          {data.assists !== undefined && <p className="text-gray-700">{`Assists: ${data.assists}`}</p>}
          {data.appearances !== undefined && <p className="text-gray-700">{`Appearances: ${data.appearances}`}</p>}
          {data.value !== undefined && data.goals === undefined && <p className="text-gray-700">{`Value: ${data.value}`}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title || "Statistics"}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full">
          {isClient && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedData}
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
                  {processedData.map((entry, index) => (
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
