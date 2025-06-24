
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Home, User} from "lucide-react";
import { ReactNode } from "react";

import { LucideProps } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
}
  
  export const StatCard = ({ title, value, description, icon }: StatCardProps) => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </CardContent>
      </Card>
    );
  };



  interface ActivityItemProps {
    title: string;
    timestamp: string;
    icon ?: ReactNode;
  }
  
  export const ActivityItem = ({ title, timestamp, icon }: ActivityItemProps) => {
    return (
      <div className="flex items-center p-4 border rounded-lg">
        <div className="bg-gray-100 p-2 rounded-full mr-3">
            {icon ? icon :  <Home className="h-5 w-5 text-[#0253CC]" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{timestamp}</p>
        </div>
      </div>
    );
  };
  

  interface ScheduledViewingProps {
    property: string;
    date: string;
    time: string;
    agent: string;
    isPast?: boolean;
  }
  
  export const ScheduledViewing = ({ property, date, time, agent, isPast = false }: ScheduledViewingProps) => {
    return (
      <div className={`p-4 border rounded-lg ${isPast ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium">{property}</h3>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {date}
              </span>
              <span className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {time}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <User className="mr-1 h-4 w-4" />
              Agent: {agent}
            </div>
          </div>
          {!isPast && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Reschedule</Button>
              <Button variant="destructive" size="sm">Cancel</Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  

export function HeartFilled(props: LucideProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor" // This makes it filled!
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21s-6-4.35-10-8.87C-2 6 5.5 0 12 5.5 18.5 0 26 6 22 12.13 18 16.65 12 21 12 21z" />
    </svg>
  );
}


