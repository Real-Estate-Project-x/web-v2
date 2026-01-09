'use client';


import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Search,
  Filter,
  Eye
} from "lucide-react";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios-interceptor";
import { ScheduleDialog } from "./dialogs/schedule-viewing";
import { LoaderViewings } from "@/components/shared/loader-cards";

interface Viewing {
  id: string;
  propertyAddress: string;
  propertyType: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAvatar?: string;
  status: "upcoming" | "confirmed" | "pending" | "completed" | "cancelled";
  notes?: string;
  price: number;
}

const Viewings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("VIRTUAL_PROPERTY_VIEWING_FEE");
  const [feeSetupId, setFeeSetupId] = useState("");
  const [viewings, setViewings] = useState<Viewing[]>([]);

  // Mock data for scheduled viewings
  // const viewings: Viewing[] = [
  //   {
  //     id: "1",
  //     propertyAddress: "123 Beverly Hills Dr, Los Angeles, CA",
  //     propertyType: "Luxury Home",
  //     date: "2024-06-15",
  //     time: "10:00 AM",
  //     clientName: "John Smith",
  //     clientEmail: "john.smith@email.com",
  //     clientPhone: "+1 (555) 123-4567",
  //     status: "confirmed",
  //     price: 2400000,
  //     notes: "Client interested in the pool area and garage space"
  //   },
  //   {
  //     id: "2",
  //     propertyAddress: "456 Sunset Blvd, West Hollywood, CA",
  //     propertyType: "Condo",
  //     date: "2024-06-15",
  //     time: "2:30 PM",
  //     clientName: "Maria Garcia",
  //     clientEmail: "maria.garcia@email.com",
  //     clientPhone: "+1 (555) 987-6543",
  //     status: "upcoming",
  //     price: 1800000,
  //     notes: "First-time buyer, needs detailed explanation"
  //   },
  //   {
  //     id: "3",
  //     propertyAddress: "789 Ocean Ave, Santa Monica, CA",
  //     propertyType: "Beachfront",
  //     date: "2024-06-16",
  //     time: "11:15 AM",
  //     clientName: "David Wilson",
  //     clientEmail: "david.wilson@email.com",
  //     clientPhone: "+1 (555) 456-7890",
  //     status: "pending",
  //     price: 3200000
  //   },
  //   {
  //     id: "4",
  //     propertyAddress: "321 Hollywood Hills Rd, Los Angeles, CA",
  //     propertyType: "Modern Villa",
  //     date: "2024-06-16",
  //     time: "4:00 PM",
  //     clientName: "Sarah Johnson",
  //     clientEmail: "sarah.johnson@email.com",
  //     clientPhone: "+1 (555) 234-5678",
  //     status: "confirmed",
  //     price: 2950000,
  //     notes: "Interested in smart home features"
  //   },
  //   {
  //     id: "5",
  //     propertyAddress: "654 Malibu Coast Hwy, Malibu, CA",
  //     propertyType: "Beach House",
  //     date: "2024-06-14",
  //     time: "9:00 AM",
  //     clientName: "Michael Brown",
  //     clientEmail: "michael.brown@email.com",
  //     clientPhone: "+1 (555) 345-6789",
  //     status: "completed",
  //     price: 4100000
  //   }
  // ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAndSortedViewings = viewings
    .filter(viewing => {
      const matchesSearch = viewing.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        viewing.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || viewing.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime();
        // case "client":
        //   return a.clientName.localeCompare(b.clientName);
        case "price":
          return b.price - a.price;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const upcomingViewings = viewings.filter(v => v.status === "upcoming" || v.status === "confirmed").length;
  const pendingViewings = viewings.filter(v => v.status === "pending").length;
  const completedViewings = viewings.filter(v => v.status === "completed").length;

  useEffect(() => {
    // VIRTUAL_PROPERTY_VIEWING_FEE, IN_PERSON_PROPERTY_VIEWING_FEE,PROPERTY_AD_BOOSTING filter based on these
    axiosInstance.get(`/fee-setup/${sortBy}`)
    .then(response => {
      setFeeSetupId(response?.data?.id);
    }).catch(error => { 
      console.error("Error fetching fee setup data:", error);
    });

    //f3c8e0c9-1a43-4dc5-b47b-ff5e3626a58e
    axiosInstance.get(`/agent-property-viewing?feeSetupId=${feeSetupId}`)
    .then(response => {
      setViewings(response.data?.data || []);
    }).catch(error => { 
      console.error("Error fetching viewings:", error);
    });

  },[sortBy]);

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Scheduled Viewings</h1>
          <p className="text-muted-foreground mb-4">Manage your property viewings and client appointments</p>
          <ScheduleDialog/>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Viewings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingViewings ? upcomingViewings : 0}</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Confirmations</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingViewings ? pendingViewings : 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedViewings ? completedViewings : 0}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative col-span-1 md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by property or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIRTUAL_PROPERTY_VIEWING_FEE">Sort by Virtual Viewings</SelectItem>
                  <SelectItem value="IN_PERSON_PROPERTY_VIEWING_FEE">Sort by In-person Viewings</SelectItem>
                  {/* <SelectItem value="status">Sort by Status</SelectItem> */}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setSortBy("date");}}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {!viewings ?
          <LoaderViewings/>
          :
          <div className="space-y-4">
          {filteredAndSortedViewings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No viewings found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your filters or search terms"
                    : "You don't have any scheduled viewings yet"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedViewings.map((viewing) => (
              <Card key={viewing.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Property and Time Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{viewing.propertyAddress}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {viewing.propertyType}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(viewing.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {viewing.time}
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(viewing.status)}>
                          {viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        ${viewing.price.toLocaleString()}
                      </div>
                      
                      {viewing.notes && (
                        <p className="text-sm text-muted-foreground italic">
                          "{viewing.notes}"
                        </p>
                      )}
                    </div>

                    {/* Client Info */}
                    <div className="lg:w-80">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarImage src={viewing.clientAvatar} />
                          <AvatarFallback>
                            {viewing.clientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{viewing.clientName}</h4>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {viewing.clientEmail}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {viewing.clientPhone}
                            </div>
                          </div>
                        </div>
                        
                      </div>
                      <div className="mb-3 pl-2">
                        {viewing.status === "confirmed" && 
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                               <Link href={"https://meet.google.com/rty-yahj-mzo"} target="_blank" className="text-sm text-blue-600 italic">Click to Join</Link>
                              
                            </div>
                        }
                      </div>
                      <div className="flex gap-2">
                        {/* <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button> */}
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Add Pagination to this page */}
        </div>
      }
      </div>
    </div>
  );
};

export default Viewings;

