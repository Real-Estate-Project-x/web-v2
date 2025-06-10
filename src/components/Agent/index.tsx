'use client';
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Star,
  Phone,
  Mail,
  MapPin,
  Bell,
  Settings,
  
} from "lucide-react";
import Navbar from "../pages/Home/Nav";
import PropertyStatsChart from "./components/Dashboard/property-stats-chart";
import RevenueChart from "./components/Dashboard/revenue-chart";
import TopPerformingProperties from "./components/Dashboard/top-performing-properties";
import PropertyTypesChart from "./components/Dashboard/property-types-chat";
import RecentActivities from "./components/Dashboard/recent-activities";

  const agentData = {
    name: "Sarah Johnson",
    title: "Senior Real Estate Agent",
    email: "sarah.johnson@realestate.com",
    phone: "+1 (555) 123-4567",
    location: "Los Angeles, CA",
    avatar: "/placeholder.svg",
    rating: 4.9,
    totalReviews: 147,
    yearsExperience: 8,
    totalSales: 2847000,
    propertiesSold: 45,
    activeListings: 12,
    clientsSatisfied: 132
  };

export const agentDashboardData = [
    { href: "/agent-dashboard", label: "Dashboard" },
    { href: "/agent-dashboard/properties", label: "Agent Properties" },
    { href: "/agent-dashboard/users", label: "Users" },
    { href: "/agent-dashboard/viewings", label: "Viewings" },
    {href : "/agent-dashboard/notifications", label: <Bell className="h-4 w-4"/>},
    {href : "/agent-dashboard/settings", label: <Settings className="h-4 w-4"/>},
    { href: "/agent-dashboard/profile", label: <Avatar className="h-10 w-10">
        <AvatarImage src={agentData.avatar} alt={agentData.name} />
        <AvatarFallback>{agentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar> }
];

const AgentDashboard = () => {

  // Mock statistics data
  const stats = [
    {
      title: "Total Revenue",
      value: `$${(agentData.totalSales / 1000000).toFixed(1)}M`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "This month"
    },
    {
      title: "Properties Sold",
      value: agentData.propertiesSold.toString(),
      change: "+8.2%",
      trend: "up",
      icon: Home,
      description: "This year"
    },
    {
      title: "Active Listings",
      value: agentData.activeListings.toString(),
      change: "+3",
      trend: "up",
      icon: TrendingUp,
      description: "Current month"
    },
    {
      title: "Client Satisfaction",
      value: `${Math.round((agentData.clientsSatisfied / agentData.totalReviews) * 100)}%`,
      change: "+2.1%",
      trend: "up",
      icon: Users,
      description: "Overall rating"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar data={agentDashboardData}/>
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Agent Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={agentData.avatar} alt={agentData.name} />
                  <AvatarFallback>{agentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold">{agentData.name}</h1>
                      <p className="text-lg text-muted-foreground">{agentData.title}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{agentData.rating}</span>
                          <span className="text-muted-foreground">({agentData.totalReviews} reviews)</span>
                        </div>
                        <Badge variant="secondary">{agentData.yearsExperience} years experience</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {agentData.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {agentData.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {agentData.location}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`inline-flex items-center ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  {' '}{stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-[400px] grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PropertyStatsChart />
              <RevenueChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TopPerformingProperties />
              </div>
              <PropertyTypesChart />
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PropertyStatsChart />
              <PropertyTypesChart />
            </div>
            <TopPerformingProperties />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <PropertyStatsChart />
            </div>
            <PropertyTypesChart />
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <RecentActivities />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDashboard;