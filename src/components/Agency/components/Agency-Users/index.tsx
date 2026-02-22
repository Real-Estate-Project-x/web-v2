"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { User, Mail, Phone, Home, Star, Users } from "lucide-react";
import UserDetailsModal from "./dialogs/view-agency-user";
import { axiosInstance } from "@/lib/axios-interceptor";
import { AgentUsersInterface } from "../../../../../utils/interfaces";
import { AddAgent } from "./dialogs/add-agent";

interface AgencyUsersViewProps {
  searchTerm: string;
  sortBy: string;
  currentPage: number;
  setCurrentPage?: (page: number) => void;
}

const AgencyUsersView = ({
  searchTerm,
  sortBy,
  currentPage,
  setCurrentPage,
}: AgencyUsersViewProps) => {
  const itemsPerPage = 6;
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentsUsers, setAgentsUsers] = useState<AgentUsersInterface>(
    {} as AgentUsersInterface
  );
  const [refreshState, setRefreshState] = useState<boolean>(false);
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
    let filtered = agentsUsers?.activeSubAgents?.filter((agent) => {
      agent?.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent?.user?.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        agent?.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
      //|| agent?.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    });

    filtered?.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a?.user?.firstName.localeCompare(b?.user?.firstName);
        case "email":
          return a?.user?.email.localeCompare(b?.user?.email);
        // case "sales":
        //   return b.totalSales - a.totalSales;
        case "listings":
          return b.totalListings - a.totalListings;
        case "joined":
          return (
            new Date(b?.user?.dateCreated).getTime() -
            new Date(a?.user?.dateCreated).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, sortBy]);

  // Pagination logic

  const paginatedReturn = (dataSet: Array<any>) => {
    const totalPages = Math.ceil(
      filteredAndSortedAgents?.length / itemsPerPage
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = dataSet?.slice(startIndex, startIndex + itemsPerPage);
    return {
      totalPages,
      startIndex,
      paginatedData,
    };
  };

  //48de2418-9e30-4cb9-b3e7-438e406db377
  useEffect(() => {
    axiosInstance
      .get(
        `/agency/list-agents-under-agency/dashboard/8b6c7c37-72b5-4db8-9184-214f32b8b68d`
      )
      .then((res) => {
        setAgentsUsers(res.data.data);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [refreshState]);

  return (
    <>
      <div className="container mx-auto space-y-6 p-5">
        {/* Summary Widgets */}
        <div className="my-4">
          <h2 className="text-3xl md:text-2xl font-semibold">Users</h2>
          <p className="text-muted-foreground text-lg">View and track User activity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sub-Agents
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agentsUsers?.totalSubAgents ? agentsUsers?.totalSubAgents : 0}
              </div>
              <p className="text-xs text-muted-foreground">Active agents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers/Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agentsUsers?.totalCustomers ? agentsUsers.totalCustomers : 0}
              </div>
              <p className="text-xs text-muted-foreground">Active Users </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Listings
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agentsUsers?.totalListings ? agentsUsers?.totalListings : 0}
              </div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agentsUsers?.rating ? agentsUsers.rating.toFixed(1) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Customer satisfaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Agents Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Sub-Agents ({agentsUsers?.totalSubAgents ?? 0})
            </CardTitle>
            <CardDescription className="flex flex-col items-start">
              Manage and view performance of all sub-agents in your agency.
              Click on any row to view detailed information.
              <AddAgent setRefresh={setRefreshState} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {
              // paginatedReturn(filteredAndSortedAgents)?.totalPages  > 1
              agentsUsers?.activeSubAgents?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>PhoneNumber</TableHead>
                      {/* <TableHead>Specialization</TableHead>
                  <TableHead>Sales</TableHead> */}
                      <TableHead>Listings</TableHead>
                      {/* <TableHead>Rating</TableHead>
                  <TableHead>Commission</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReturn(
                      agentsUsers?.activeSubAgents
                    )?.paginatedData?.map((agent, index) => (
                      <TableRow
                        key={index}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleUserClick(agent)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {/* <AvatarImage src={''}  alt={`${agent?.activeSubAgents?.firstName} ${agent?.activeSubAgents?.lastName}`} /> */}
                              <AvatarFallback>
                                {agent?.user?.firstName?.[0]}
                                {agent?.user?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {agent?.user?.firstName} {agent?.user?.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Joined{" "}
                                {new Date(
                                  agent?.user?.dateCreated
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {agent?.user?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {agent?.user?.phoneNumber}
                          </div>
                        </TableCell>
                        {/* <TableCell>
                      <Badge variant="secondary">{agent.specialization}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${(agent.totalSales / 1000000).toFixed(1)}M</div>
                    </TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            {agent?.totalListings}
                          </div>
                        </TableCell>
                        {/* <TableCell>
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
              ) : (
                <p className="text-base text-center text-grey-300">
                  No Records Found
                </p>
              )
            }

            {/* Pagination */}
            {paginatedReturn(agentsUsers?.activeSubAgents)?.totalPages > 1 && (
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
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from(
                      {
                        length: paginatedReturn(agentsUsers?.activeSubAgents)
                          ?.totalPages,
                      },
                      (_, i) => i + 1
                    ).map((page) => (
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
                        className={
                          currentPage ===
                          paginatedReturn(agentsUsers?.activeSubAgents)
                            ?.totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
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
