'use client';
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  User, 
  Mail, 
  Phone, 
  TrendingUp, 
  Home,
  DollarSign,
  Star
} from "lucide-react";
import UserDetailsModal from "./dialogs/view-agency-user";
import Navbar from "@/components/pages/Home/Nav";
import { agentDashboardData } from "../..";

interface AgencyUsersViewProps {
  searchTerm: string;
  sortBy: string;
  currentPage: number;
  setCurrentPage ?: (page: number) => void;
}

const AgencyUsersView = ({ searchTerm, sortBy, currentPage, setCurrentPage }: AgencyUsersViewProps) => {
  const itemsPerPage = 6;
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock sub-agents data
  const subAgents = [
    {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@agency.com",
      phone: "+1 (555) 123-4567",
      specialization: "Residential",
      totalSales: 2400000,
      activeListings: 8,
      commissionRate: 6.5,
      rating: 4.8,
      reviews: 45,
      joined: "2023-01-15",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@agency.com",
      phone: "+1 (555) 234-5678",
      specialization: "Luxury Properties",
      totalSales: 3200000,
      activeListings: 12,
      commissionRate: 7.0,
      rating: 4.9,
      reviews: 67,
      joined: "2022-08-20",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@agency.com",
      phone: "+1 (555) 345-6789",
      specialization: "Commercial",
      totalSales: 5600000,
      activeListings: 6,
      commissionRate: 8.0,
      rating: 4.7,
      reviews: 32,
      joined: "2023-03-10",
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@agency.com",
      phone: "+1 (555) 456-7890",
      specialization: "First-Time Buyers",
      totalSales: 1800000,
      activeListings: 15,
      commissionRate: 6.0,
      rating: 4.6,
      reviews: 28,
      joined: "2023-05-22",
      avatar: "/placeholder.svg"
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@agency.com",
      phone: "+1 (555) 567-8901",
      specialization: "Investment Properties",
      totalSales: 4100000,
      activeListings: 9,
      commissionRate: 7.5,
      rating: 4.8,
      reviews: 52,
      joined: "2022-11-30",
      avatar: "/placeholder.svg"
    },
    {
      id: 6,
      firstName: "Lisa",
      lastName: "Anderson",
      email: "lisa.anderson@agency.com",
      phone: "+1 (555) 678-9012",
      specialization: "Residential",
      totalSales: 2900000,
      activeListings: 11,
      commissionRate: 6.5,
      rating: 4.7,
      reviews: 39,
      joined: "2023-02-14",
      avatar: "/placeholder.svg"
    }
  ];

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Filter and sort logic
  const filteredAndSortedAgents = useMemo(() => {
    let filtered = subAgents.filter(agent => 
      agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.firstName.localeCompare(b.firstName);
        case "email":
          return a.email.localeCompare(b.email);
        case "sales":
          return b.totalSales - a.totalSales;
        case "listings":
          return b.activeListings - a.activeListings;
        case "joined":
          return new Date(b.joined).getTime() - new Date(a.joined).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedAgents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgents = filteredAndSortedAgents.slice(startIndex, startIndex + itemsPerPage);

  // Calculate summary stats
  const totalAgents = filteredAndSortedAgents.length;
  const totalSales = filteredAndSortedAgents.reduce((sum, agent) => sum + agent.totalSales, 0);
  const totalListings = filteredAndSortedAgents.reduce((sum, agent) => sum + agent.activeListings, 0);
  const averageRating = filteredAndSortedAgents.reduce((sum, agent) => sum + agent.rating, 0) / totalAgents;

  return (
    <>
    <Navbar data={agentDashboardData}/>
    <div className="container mx-auto space-y-6">
      {/* Summary Widgets */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sub-Agents</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground">Active agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Combined Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalSales / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Total sales volume</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>
        {/*Users Table  */}
         <Card>
        <CardHeader>
          <CardTitle>Users under Agency ({filteredAndSortedAgents.length})</CardTitle>
          <CardDescription>
           List of Customers using Agency. Click on any row to view detailed information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Rating</TableHead>
                <TableHead>Commission</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAgents.map((agent) => (
                <TableRow 
                  key={agent.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleUserClick(agent)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.avatar} alt={`${agent.firstName} ${agent.lastName}`} />
                        <AvatarFallback>{agent.firstName[0]}{agent.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agent.firstName} {agent.lastName}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined {new Date(agent.joined).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {agent.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {agent.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{agent.specialization}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${(agent.totalSales / 1000000).toFixed(1)}M</div>
                  </TableCell>
                  {/* <TableCell>
                    <div className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {agent.activeListings}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{agent.rating}</span>
                      <span className="text-muted-foreground text-sm">({agent.reviews})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{agent.commissionRate}%</div>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          //setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sub-Agents ({filteredAndSortedAgents.length})</CardTitle>
          <CardDescription>
            Manage and view performance of all sub-agents in your agency. Click on any row to view detailed information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAgents.map((agent) => (
                <TableRow 
                  key={agent.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleUserClick(agent)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.avatar} alt={`${agent.firstName} ${agent.lastName}`} />
                        <AvatarFallback>{agent.firstName[0]}{agent.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agent.firstName} {agent.lastName}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined {new Date(agent.joined).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {agent.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {agent.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{agent.specialization}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${(agent.totalSales / 1000000).toFixed(1)}M</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {agent.activeListings}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{agent.rating}</span>
                      <span className="text-muted-foreground text-sm">({agent.reviews})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{agent.commissionRate}%</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          //setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={selectedUser}
      />
    </div>
    </>
  );
};

export default AgencyUsersView;