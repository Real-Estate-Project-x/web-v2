'use client';

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  Home,
  Star,
  Calendar,
  TrendingUp
} from "lucide-react";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
    totalSales: number;
    activeListings: number;
    commissionRate: number;
    rating: number;
    reviews: number;
    joined: string;
    avatar: string;
  } | null;
}

const UserDetailsModal = ({ isOpen, onClose, user }: UserDetailsModalProps) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-semibold">{user.firstName} {user.lastName}</div>
              <Badge variant="secondary">{user.specialization}</Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Sub-agent details and performance overview
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {new Date(user.joined).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">${(user.totalSales / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Total Sales</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{user.activeListings}</div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">{user.rating}</div>
                <div className="text-sm text-muted-foreground">Rating ({user.reviews} reviews)</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{user.commissionRate}%</div>
                <div className="text-sm text-muted-foreground">Commission Rate</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Specialization:</span>
                <span>{user.specialization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Sales per Listing:</span>
                <span>${user.activeListings > 0 ? Math.round(user.totalSales / user.activeListings).toLocaleString() : 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Review Score:</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {user.rating} ({user.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;