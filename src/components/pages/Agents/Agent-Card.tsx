'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  TrendingUp
} from "lucide-react";

interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  totalSales: number;
  propertiesSold: number;
  activeListings: number;
  yearsExperience: number;
  location: string;
  phone: string;
  email: string;
  specialties: string[];
  available: boolean;
  responseTime: string;
}

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  return (
    <Card className="group h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-white shadow-lg">
              <AvatarImage src={agent.avatar} alt={`${agent.firstName} ${agent.lastName}`} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-blue-600 text-white">
                {agent.firstName[0]}{agent.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm ${
              agent.available ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {agent.firstName} {agent.lastName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{agent.title}</p>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-900">{agent.rating}</span>
                <span className="text-xs text-gray-500">({agent.reviewCount})</span>
              </div>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-600">{agent.responseTime}</span>
            </div>
          </div>
          
          <Badge 
            variant={agent.available ? "default" : "secondary"}
            className="text-xs"
          >
            {agent.available ? "Available" : "Busy"}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{agent.propertiesSold}</div>
            <div className="text-xs text-gray-500">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              ${(agent.totalSales / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-500">Total Sales</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{agent.yearsExperience}</div>
            <div className="text-xs text-gray-500">Years Exp</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{agent.location}</span>
        </div>

        {/* Specialties */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1">
            {agent.specialties.slice(0, 2).map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                {specialty}
              </Badge>
            ))}
            {agent.specialties.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{agent.specialties.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg"
            size="sm"
          >
            Contact Agent
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;