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
  TrendingUp,
  MessageCircle,
  Circle,
  PhoneCall
} from "lucide-react";
import { AgentInterface } from "../../../../utils/interfaces";

interface AgentCardProps {
  agent: AgentInterface;
}

const AgentCard = ({ agent : data }: AgentCardProps) => {

  const agent = data?.agency;
  const firstNameInitials = agent?.name?.split(' ')[0];
  const lastNameInitials = agent?.name?.split(' ')[1];

  return (
    <Card className="group h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-white shadow-lg">
              <AvatarImage src={agent.logo} alt={`${agent.name}`} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-blue-600 text-white">
                {firstNameInitials[0]} {lastNameInitials[0]}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm ${
              agent.status ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1 capitalize">
              {agent.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 normal-case">{agent.description}</p>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-900">{agent.rating}</span>
                <span className="text-xs text-gray-500">({data?.totalReviewCount})</span>
              </div>
              {/* <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-600">{agent.responseTime}</span> */}
            </div>
          </div>
          
          <Badge 
            variant={agent.status ? "default" : "secondary"}
            className="text-xs bg-[#25D366] text-black"
          >
            {agent.status ? "Available" : "Busy"}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            {/* <div className="text-lg font-bold text-gray-900">{agent.propertiesSold}</div> */}
            <div className="text-xs text-gray-500">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              ${data.viewingsCount}
            </div>
            <div className="text-xs text-gray-500">Scheduled Viewings</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{data.timeSinceJoined}</div>
            <div className="text-xs text-gray-500">Time Joined</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 capitalize">{agent.address}</span>
        </div>

        {/* Specialties */}
        <div className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
            {data?.propertyTypes.slice(0, 5).map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                {specialty.name}
              </Badge>
            ))}
            {data?.propertyTypes.length > 5 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{data.propertyTypes.length - 5}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between  gap-2">
          <div className="flex items-center gap-1 text-base">
            <PhoneCall className="h-6 w-6 text-[#25D366]"/>
            <p>{agent.whatsappNumber}</p>
          </div>
          <div className="flex items-center gap-1 text-base">
            <Mail className="h-6 w-6 text-gray-400"/>
            <p>{agent.email}</p>
          </div>
          
          <Button variant="outline" size="sm" className="px-3">
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;