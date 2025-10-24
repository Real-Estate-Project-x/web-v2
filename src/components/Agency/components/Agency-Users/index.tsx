'use client';
import React, { useState, useMemo, useEffect } from "react";
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
  Home,
  DollarSign,
  Star,
  Users
} from "lucide-react";
import UserDetailsModal from "./dialogs/view-agency-user";
import { agentDashboardData } from "../..";
import { axiosInstance } from "@/lib/axios-interceptor";
import { AgentUsersInterface } from "../../../../../utils/interfaces";

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
  const [agentsUsers, setAgentsUsers] = useState<AgentUsersInterface>({} as AgentUsersInterface);

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
    let filtered = agentsUsers?.activeSubAgents?.filter(agent => 
      agent?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent?.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered?.sort((a, b) => {
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

    const filteredAndSortedCustomers = useMemo(() => {
    let filtered = agentsUsers?.customers?.filter(customers => 
      customers?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customers?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customers?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customers?.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered?.sort((a, b) => {
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

  const paginatedReturn = (dataSet : Array<any>) => {
    const totalPages = Math.ceil(filteredAndSortedAgents?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData= dataSet?.slice(startIndex, startIndex + itemsPerPage);
    return{
      totalPages,
      startIndex,
      paginatedData
    }
  }

  // Calculate summary stats
  const totalAgents = filteredAndSortedAgents?.length;
  const totalSales = filteredAndSortedAgents?.reduce((sum, agent) => sum + agent.totalSales, 0);
  const totalListings = filteredAndSortedAgents?.reduce((sum, agent) => sum + agent.activeListings, 0);
  const averageRating = filteredAndSortedAgents?.reduce((sum, agent) => sum + agent.rating, 0) / totalAgents;

  useEffect(() => {
    axiosInstance.get('/agency/list-agents-under-agency/dashboard/48de2418-9e30-4cb9-b3e7-438e406db377')
    .then(res => {
     setAgentsUsers(res.data.data);
    }).catch(err => {
      console.log({err});
    })
  },[]);

  return (
    <>
    <div className="container mx-auto space-y-6">
      {/* Summary Widgets */}
       <div className="my-4">
          <h2 className="text-2xl font-semibold">Users</h2>
          <p className="text-muted-foreground">View and track User activity</p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sub-Agents</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentsUsers?.activeSubAgents ? agentsUsers?.activeSubAgents : 0}</div>
            <p className="text-xs text-muted-foreground">Active agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers/Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentsUsers?.totalCustomers ? agentsUsers.totalCustomers : 0}</div>
            <p className="text-xs text-muted-foreground">Active Users </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentsUsers?.totalListings ? agentsUsers?.totalListings : 0}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentsUsers?.rating ? agentsUsers.rating.toFixed(1) : 0}</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>
        {/*Users Table  */}
        <Card>
          <CardHeader>
            <CardTitle>Users under Agency ({filteredAndSortedCustomers?.length})</CardTitle>
            <CardDescription>
            List of Customers using Agency. Click on any row to view detailed information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {
              paginatedReturn(filteredAndSortedCustomers)?.totalPages  > 1 ?
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
                  {paginatedReturn(filteredAndSortedCustomers).paginatedData?.map((agent) => (
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
            :
              <p>Zero Records Found</p>
            }

            {/* Pagination */}
            {paginatedReturn(filteredAndSortedCustomers)?.totalPages > 1 && (
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
                    
                    {Array.from({ length: paginatedReturn(filteredAndSortedCustomers).totalPages }, (_, i) => i + 1).map((page) => (
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
                        className={currentPage === paginatedReturn(filteredAndSortedCustomers).totalPages  ? "pointer-events-none opacity-50" : ""}
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
          <CardTitle>Sub-Agents ({filteredAndSortedAgents?.length})</CardTitle>
          <CardDescription>
            Manage and view performance of all sub-agents in your agency. Click on any row to view detailed information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {
            paginatedReturn(filteredAndSortedAgents)?.totalPages  > 1 ?
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
                {paginatedReturn(filteredAndSortedAgents)?.paginatedData?.map((agent) => (
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
          :
            <p>Zero Records Found</p>
          }

          {/* Pagination */}
          {paginatedReturn(filteredAndSortedAgents)?.totalPages  > 1 && (
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
                  
                  {Array.from({ length: paginatedReturn(filteredAndSortedAgents)?.totalPages }, (_, i) => i + 1).map((page) => (
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
                      className={currentPage === paginatedReturn(filteredAndSortedAgents)?.totalPages ? "pointer-events-none opacity-50" : ""}
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