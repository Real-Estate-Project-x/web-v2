'use cleint';
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const RevenueChart = () => {
  const data = [
    { month: "Jan", revenue: 145000, commission: 14500 },
    { month: "Feb", revenue: 189000, commission: 18900 },
    { month: "Mar", revenue: 234000, commission: 23400 },
    { month: "Apr", revenue: 167000, commission: 16700 },
    { month: "May", revenue: 298000, commission: 29800 },
    { month: "Jun", revenue: 245000, commission: 24500 },
    { month: "Jul", revenue: 356000, commission: 35600 },
    { month: "Aug", revenue: 289000, commission: 28900 },
    { month: "Sep", revenue: 445000, commission: 44500 },
    { month: "Oct", revenue: 312000, commission: 31200 },
    { month: "Nov", revenue: 278000, commission: 27800 },
    { month: "Dec", revenue: 389000, commission: 38900 }
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))"
    },
    commission: {
      label: "Commission",
      color: "hsl(142, 76%, 36%)"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Monthly revenue and commission breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="revenue" 
                fill="var(--color-revenue)" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="commission" 
                fill="var(--color-commission)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;