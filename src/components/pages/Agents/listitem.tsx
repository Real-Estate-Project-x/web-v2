'use client';
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star,
  MapPin,
  Award,
  Home,
  TrendingUp
} from "lucide-react";
import { AgentInterface } from "../../../../utils/interfaces";

interface AgentListItemProps {
  agent: AgentInterface;
}

const AgentListItem = ({ agent : data }: AgentListItemProps) => {

  const agent = data?.agency;
  const firstNameInitials = agent?.name?.split(' ')[0];
  const lastNameInitials = agent?.name?.split(' ')[1];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
              <AvatarImage src={agent.logo} alt={`${agent.name}`} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-blue-600 text-white">
                {firstNameInitials[0]} {lastNameInitials[0]}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              agent.status ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          
          {/* Agent Info */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Basic Info */}
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 capitalize">
                  {agent.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 normal-case">{agent.description}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{agent.rating}</span>
                  {/* <span className="text-xs text-gray-500">({agent.reviewCount})</span> */}
                </div>
              </div>
              
              {/* Location & Experience */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-700 capitalize">{agent.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-3 w-3 text-gray-400" />
                  {/* <span className="text-gray-700">{agent.yearsExperience} years</span> */}
                </div>
              </div>
              
              {/* Performance */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Home className="h-3 w-3 text-gray-400" />
                  {/* <span className="text-gray-700">{agent.propertiesSold} sold</span> */}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {/* <DollarSign className="h-3 w-3 text-gray-400" />  use formatPrice instead*/}
                  {/* <span className="text-gray-700">${(agent.totalSales / 1000000).toFixed(1)}M</span> */}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant={agent.status ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {agent.status ? "Available" : "Busy"}
                  </Badge>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                    >
                      Contact
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentListItem;