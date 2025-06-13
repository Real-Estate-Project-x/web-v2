
'use client';
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  User, 
  Filter,
  Search,
  Download,
  CreditCard
} from "lucide-react";
import Navbar from "@/components/pages/Home/Nav";
import { agentDashboardData } from "../..";

interface PayoutEntry {
  id: string;
  propertyAddress: string;
  clientName: string;
  viewingDate: string;
  commission: number;
  salePrice: number;
  status: "pending" | "paid" | "processing";
  payoutDate?: string;
}

const Payouts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Mock data for agent payouts
  const payoutEntries: PayoutEntry[] = [
    {
      id: "1",
      propertyAddress: "123 Beverly Hills Dr, Los Angeles, CA",
      clientName: "John Smith",
      viewingDate: "2024-06-10",
      commission: 12000,
      salePrice: 2400000,
      status: "paid",
      payoutDate: "2024-06-15"
    },
    {
      id: "2",
      propertyAddress: "456 Sunset Blvd, West Hollywood, CA",
      clientName: "Maria Garcia",
      viewingDate: "2024-06-08",
      commission: 9000,
      salePrice: 1800000,
      status: "processing"
    },
    {
      id: "3",
      propertyAddress: "789 Ocean Ave, Santa Monica, CA",
      clientName: "David Wilson",
      viewingDate: "2024-06-12",
      commission: 16000,
      salePrice: 3200000,
      status: "pending"
    },
    {
      id: "4",
      propertyAddress: "321 Hollywood Hills Rd, Los Angeles, CA",
      clientName: "Sarah Johnson",
      viewingDate: "2024-06-05",
      commission: 14750,
      salePrice: 2950000,
      status: "paid",
      payoutDate: "2024-06-12"
    },
    {
      id: "5",
      propertyAddress: "654 Malibu Coast Hwy, Malibu, CA",
      clientName: "Michael Brown",
      viewingDate: "2024-06-01",
      commission: 20500,
      salePrice: 4100000,
      status: "pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAndSortedPayouts = payoutEntries
    .filter(entry => {
      const matchesSearch = entry.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.viewingDate).getTime() - new Date(a.viewingDate).getTime();
        case "commission":
          return b.commission - a.commission;
        case "client":
          return a.clientName.localeCompare(b.clientName);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedPayouts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredAndSortedPayouts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, itemsPerPage]);

  const totalEarnings = payoutEntries.reduce((sum, entry) => sum + entry.commission, 0);
  const pendingPayouts = payoutEntries.filter(e => e.status === "pending").reduce((sum, entry) => sum + entry.commission, 0);
  const paidPayouts = payoutEntries.filter(e => e.status === "paid").reduce((sum, entry) => sum + entry.commission, 0);
  const processingPayouts = payoutEntries.filter(e => e.status === "processing").reduce((sum, entry) => sum + entry.commission, 0);

  const handleCashout = () => {
    // This would integrate with a payment system
    alert(`Initiating cashout for $${pendingPayouts.toLocaleString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar data={agentDashboardData} />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payouts & Earnings</h1>
              <p className="text-muted-foreground">Track your commission earnings and manage payouts</p>
            </div>
            <Button 
              onClick={handleCashout} 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={pendingPayouts === 0}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              CASHOUT ${pendingPayouts.toLocaleString()}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${pendingPayouts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ready to cashout</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">${processingPayouts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${paidPayouts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by property or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="commission">Sort by Commission</SelectItem>
                  <SelectItem value="client">Sort by Client</SelectItem>
                  <SelectItem value="status">Sort by Status</SelectItem>
                </SelectContent>
              </Select>

              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setSortBy("date");
                setItemsPerPage(5);
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedPayouts.length)} of {filteredAndSortedPayouts.length} results
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Payouts List */}
        <div className="space-y-4 mb-6">
          {currentPageData.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No payouts found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your filters or search terms"
                    : "You don't have any commission earnings yet"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            currentPageData.map((entry) => (
              <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Property and Commission Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{entry.propertyAddress}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {entry.clientName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(entry.viewingDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Sale Price: <span className="font-medium">${entry.salePrice.toLocaleString()}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        ${entry.commission.toLocaleString()}
                      </div>
                      
                      {entry.payoutDate && (
                        <p className="text-sm text-muted-foreground">
                          Paid on {new Date(entry.payoutDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                      {entry.status === "pending" && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => alert(`Processing payout for $${entry.commission.toLocaleString()}`)}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Cash Out
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payouts;