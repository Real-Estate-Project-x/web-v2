'use client';

import { ActivityItem, HeartFilled, StatCard } from "@/components/shared";
import { Heart, Home, LayoutDashboard, Search, User } from "lucide-react";

export const DashboardOverview = () => {

    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Overview</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatCard 
            title="Saved Properties" 
            value="12" 
            description="Properties you've saved" 
            icon={<HeartFilled className="h-5 w-5 text-[#0253CC]" />}
          />
          <StatCard 
            title="Recent Searches" 
            value="5" 
            description="Your recent property searches" 
            icon={<Search className="h-5 w-5 text-[#0253CC] " />}
          />
          <StatCard 
            title="Property Alerts" 
            value="3" 
            description="Active property alerts" 
            icon={<Home className="h-5 w-5 text-[#0253CC]" />}
          />
        </div>
        
        <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem 
            title="Viewed 123 Main Street" 
            timestamp="2 hours ago" 
          />
          <ActivityItem 
            title="Saved 456 Oak Avenue to favorites" 
            timestamp="Yesterday" 
            icon={<HeartFilled className="h-5 w-5 text-[#0253CC]" />}
          />
          <ActivityItem 
            title="Contacted agent about 789 Pine Road" 
            timestamp="3 days ago" 
            icon={<User className="h-5 w-5 text-[#0253CC]"/>}
          />
        </div>
      </div>
    );
  };
  