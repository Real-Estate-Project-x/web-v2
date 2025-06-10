'use client';

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const PropertyTypesChart = () => {
  const data = [
    { name: "Single Family", value: 45, color: "hsl(var(--primary))" },
    { name: "Condos", value: 30, color: "hsl(142, 76%, 36%)" },
    { name: "Townhouses", value: 15, color: "hsl(45, 93%, 47%)" },
    { name: "Multi-Family", value: 10, color: "hsl(262, 83%, 58%)" }
  ];

  const chartConfig = {
    "Single Family": {
      label: "Single Family",
      color: "hsl(var(--primary))"
    },
    "Condos": {
      label: "Condos",
      color: "hsl(142, 76%, 36%)"
    },
    "Townhouses": {
      label: "Townhouses",
      color: "hsl(45, 93%, 47%)"
    },
    "Multi-Family": {
      label: "Multi-Family",
      color: "hsl(262, 83%, 58%)"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Types</CardTitle>
        <CardDescription>
          Distribution of property types sold
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PropertyTypesChart;
