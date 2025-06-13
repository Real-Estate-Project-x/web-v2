'use client';

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  DollarSign, 
  Calendar, 
  Users, 
  Phone,
  Mail
} from "lucide-react";

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: "sale",
      title: "Property Sold",
      description: "123 Oak Street sold for $485,000",
      time: "2 hours ago",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "listing",
      title: "New Listing Added",
      description: "456 Maple Avenue listed for $325,000",
      time: "4 hours ago",
      icon: Home,
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "meeting",
      title: "Client Meeting Scheduled",
      description: "Property viewing with John & Sarah Smith",
      time: "6 hours ago",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      id: 4,
      type: "call",
      title: "Client Call",
      description: "Follow-up call with potential buyer",
      time: "1 day ago",
      icon: Phone,
      color: "text-orange-600"
    },
    {
      id: 5,
      type: "lead",
      title: "New Lead Generated",
      description: "Inquiry about 789 Pine Road",
      time: "1 day ago",
      icon: Users,
      color: "text-indigo-600"
    },
    {
      id: 6,
      type: "email",
      title: "Contract Sent",
      description: "Purchase agreement sent to buyer",
      time: "2 days ago",
      icon: Mail,
      color: "text-cyan-600"
    },
    {
      id: 7,
      type: "sale",
      title: "Offer Received",
      description: "Competitive offer on 321 Elm Street",
      time: "2 days ago",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      id: 8,
      type: "listing",
      title: "Price Adjustment",
      description: "654 Birch Lane price reduced to $289,000",
      time: "3 days ago",
      icon: Home,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest actions and updates from your real estate business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold">68%</p>
              </div>
              <Badge variant="secondary">+5.2%</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Average Days on Market</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <Badge variant="secondary">-3 days</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Client Retention</p>
                <p className="text-2xl font-bold">92%</p>
              </div>
              <Badge variant="secondary">+2.1%</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Average Sale Price</p>
                <p className="text-2xl font-bold">$425K</p>
              </div>
              <Badge variant="secondary">+8.5%</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Lead Response Time</p>
                <p className="text-2xl font-bold">12min</p>
              </div>
              <Badge variant="secondary">-5min</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivities;