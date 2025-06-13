import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const PropertyStatsChart = () => {
  const data = [
    { month: "Jan", sold: 3, listed: 5, pending: 2 },
    { month: "Feb", sold: 4, listed: 6, pending: 3 },
    { month: "Mar", sold: 5, listed: 4, pending: 1 },
    { month: "Apr", sold: 3, listed: 7, pending: 4 },
    { month: "May", sold: 6, listed: 5, pending: 2 },
    { month: "Jun", sold: 4, listed: 8, pending: 3 },
    { month: "Jul", sold: 7, listed: 6, pending: 2 },
    { month: "Aug", sold: 5, listed: 9, pending: 4 },
    { month: "Sep", sold: 8, listed: 7, pending: 3 },
    { month: "Oct", sold: 6, listed: 5, pending: 2 },
    { month: "Nov", sold: 4, listed: 6, pending: 3 },
    { month: "Dec", sold: 5, listed: 4, pending: 1 }
  ];

  const chartConfig = {
    sold: {
      label: "Properties Sold",
      color: "hsl(var(--primary))"
    },
    listed: {
      label: "New Listings",
      color: "hsl(142, 76%, 36%)"
    },
    pending: {
      label: "Pending Sales",
      color: "hsl(45, 93%, 47%)"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Statistics</CardTitle>
        <CardDescription>
          Monthly overview of property activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="sold" 
                stroke="var(--color-sold)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-sold)" }}
              />
              <Line 
                type="monotone" 
                dataKey="listed" 
                stroke="var(--color-listed)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-listed)" }}
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="var(--color-pending)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-pending)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PropertyStatsChart;