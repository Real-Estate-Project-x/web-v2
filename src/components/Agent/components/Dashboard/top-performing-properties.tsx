'use client';
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const TopPerformingProperties = () => {
  const properties = [
    {
      id: 1,
      address: "123 Oak Street",
      type: "Single Family",
      price: "$485,000",
      status: "Sold",
      daysOnMarket: 12,
      trend: "up",
      commission: "$14,550"
    },
    {
      id: 2,
      address: "456 Maple Avenue",
      type: "Condo",
      price: "$325,000",
      status: "Pending",
      daysOnMarket: 8,
      trend: "up",
      commission: "$9,750"
    },
    {
      id: 3,
      address: "789 Pine Road",
      type: "Townhouse",
      price: "$398,000",
      status: "Sold",
      daysOnMarket: 25,
      trend: "down",
      commission: "$11,940"
    },
    {
      id: 4,
      address: "321 Elm Street",
      type: "Single Family",
      price: "$567,000",
      status: "Active",
      daysOnMarket: 5,
      trend: "up",
      commission: "$17,010"
    },
    {
      id: 5,
      address: "654 Birch Lane",
      type: "Condo",
      price: "$289,000",
      status: "Sold",
      daysOnMarket: 18,
      trend: "up",
      commission: "$8,670"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      "Sold": "default",
      "Pending": "secondary",
      "Active": "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Properties</CardTitle>
        <CardDescription>
          Recent property sales and active listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Days on Market</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.address}</TableCell>
                <TableCell>{property.type}</TableCell>
                <TableCell>{property.price}</TableCell>
                <TableCell>{getStatusBadge(property.status)}</TableCell>
                <TableCell>{property.daysOnMarket} days</TableCell>
                <TableCell>{property.commission}</TableCell>
                <TableCell>
                  {property.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopPerformingProperties;