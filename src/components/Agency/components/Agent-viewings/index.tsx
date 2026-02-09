"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Search,
  Filter,
  Eye,
  User,
  TypeIcon,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios-interceptor";
import { LoaderViewings } from "@/components/shared/loader-cards";
import { getLocalStorageFieldRaw } from "../../../../../utils/helpers";
import { toast } from "sonner";
import { format } from "date-fns";
import { reformatDate } from "@/lib/utils";
import { RescheduleViewingDialog } from "./dialogs/Reschedule-viewing";
import { AgencyId } from "@/lib/constants";
import {
  AgencyScheduleInterface,
  PaginationControlInterface,
} from "../../../../../utils/interfaces";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";

const Viewings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewings, setViewings] = useState<any[]>([]);
  const agencyId = getLocalStorageFieldRaw("agentId");
  const [sortBy, setSortBy] = useState<string>("");
  const [schedules, setSchedules] = useState<AgencyScheduleInterface[]>([]);
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "past":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchAgentViewings = async (pageNumber = 1, pageSize = 10) => {
    try {
      const viewingsResponse = await axiosInstance.get(
        `/agent-property-viewing/agency/viewing-list/${agencyId}?filter=${statusFilter}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      if (viewingsResponse?.data?.success) {
        setViewings(viewingsResponse?.data?.data);
        setPagination(viewingsResponse?.data?.paginationControl);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  const loadData = async (page: number) => {
    await fetchAgentViewings(page);
  };
  useEffect(() => {
    loadData(1);
  }, [agencyId, statusFilter]);

  useEffect(() => {
    // get time slots
    async function getSchedules() {
      try {
        const schedules = await axiosInstance.get(
          `/agency-availability/open-windows/${AgencyId}`
        );

        if (schedules?.data?.success) {
          if (schedules?.data?.data?.length > 0) {
            const formattedData = schedules?.data?.data?.map(
              (s: AgencyScheduleInterface) => {
                const date = reformatDate(s.date);
                return {
                  ...s,
                  date,
                };
              }
            );
            setSchedules(formattedData);
            return;
          }
          setSchedules([]);
        }
      } catch (err) {
        console.log({ err });
      }
    }
    getSchedules();
  }, []);

  const filterViewings = viewings?.filter((v) => {
    const search = searchTerm?.toLowerCase();

    const matchesSearch =
      !search ||
      v?.property?.address?.toLowerCase()?.includes(search) ||
      v?.property?.title?.toLowerCase()?.includes(search) ||
      v?.user?.firstName?.toLowerCase()?.includes(search) ||
      v?.user?.lastName?.toLowerCase()?.includes(search) ||
      v?.property?.propertyType?.name?.toLowerCase()?.includes(search) ||
      v?.medium?.toUpperCase()?.includes(sortBy?.toUpperCase());

    const matchSort = !sortBy || sortBy === "" || v?.medium === sortBy;

    return matchesSearch && matchSort;
  });

  const upcomingViewings = viewings?.filter(
    (v) => v?.viewingStatus === "UPCOMING"
  ).length;
  const pendingViewings = viewings?.filter(
    (v) => v?.viewingStatus === "PENDING"
  ).length;
  const todayViewings = viewings?.filter(
    (v) => v?.viewingStatus === "TODAY"
  ).length;

  if (!viewings) {
    return <LoaderViewings />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Scheduled Viewings</h1>
          <p className="text-muted-foreground mb-4">
            Manage your property viewings and client appointments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Viewings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {upcomingViewings ? upcomingViewings : 0}
              </div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Confirmations
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingViewings ? pendingViewings : 0}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Viewings Today
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayViewings ? todayViewings : 0}
              </div>
              <p className="text-xs text-muted-foreground">Within 24 hours</p>
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="TODAY">Today</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="PAST">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filterViewings?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No viewings found
                </h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters or search terms"
                    : "You don't have any scheduled viewings yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filterViewings?.map((viewing: any) => (
              <Card
                key={viewing.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="py-4 px-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Property and Time Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge
                            className={
                              viewing?.medium === "IN_PERSON"
                                ? "bg-blue-900 text-white p-2 mb-2"
                                : "bg-slate-300 text-black p-2 mb-2"
                            }
                          >
                            {viewing?.medium}&nbsp;VIEWING
                          </Badge>

                          <h3 className="text-lg font-semibold mb-1 capitalize">
                            {viewing?.property?.title}
                          </h3>
                          <p className="text-lg text-muted-foreground mb-1 capitalize flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {viewing?.property?.address}
                          </p>
                          <div className="flex items-start gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 capitalize">
                              <TypeIcon className="h-4 w-4" />
                              {viewing?.property?.propertyType?.name}
                            </span>
                            <p className="flex flex-col space-y-2">
                              <span className="flex items-center gap-1 text-base">
                                <Calendar className="h-4 w-4" />
                                {format(
                                  reformatDate(
                                    viewing?.availabilityWindow?.date
                                  ),
                                  "EEEE, MMMM d, yyyy"
                                )}
                              </span>

                              <span className="flex items-center gap-1 text-base">
                                <Clock className="h-4 w-4" />
                                {viewing?.availabilityWindow?.timeSlot}
                              </span>
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`${getStatusColor(
                            viewing?.viewingStatus
                          )} p-2`}
                        >
                          {viewing?.viewingStatus.charAt(0).toUpperCase() +
                            viewing?.viewingStatus.slice(1)}
                        </Badge>
                      </div>
                      {viewing?.price && (
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          ₦{viewing?.price?.toLocaleString()}
                        </div>
                      )}

                      {viewing?.comment && (
                        <p className="text-sm text-muted-foreground italic">
                          "{viewing?.comment}"
                        </p>
                      )}
                      {viewing?.propertyId && (
                        <Link
                          href={`/agent-dashboard/properties/view?id=${viewing?.propertyId}`}
                          target="_blank"
                          className="text-base text-blue-800 mt-2 capitalize italic"
                        >
                          click to see Property
                        </Link>
                      )}
                    </div>

                    {/* Client Info */}
                    <div className="w-fit">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar>
                          <User />
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {viewing?.user?.firstName}&nbsp;
                            {viewing?.user?.lastName}
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center text-base gap-1 py-1.5">
                              <Mail className="h-4 w-4 mr-2" />
                              {viewing?.user?.email}
                            </div>
                            <div className="flex items-center text-base gap-1 py-1.5">
                              <Phone className="h-4 w-4 mr-2" />
                              {viewing?.user?.phoneNumber}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 pl-2">
                        {viewing?.medium === "VIRTUAL" && !viewing?.isPaid && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <Link
                              href={viewing?.meetingLink ?? ""}
                              target="_blank"
                              className="text-sm text-blue-600 italic"
                            >
                              Click to Join
                            </Link>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {/* <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Reschedule
                        </Button> */}
                        <RescheduleViewingDialog schedules={schedules} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Add Pagination to this page */}
          {pagination?.currentPage && (
            <DynamicPagination
              currentPage={pagination?.currentPage}
              totalPages={pagination?.totalPages}
              hasNext={pagination?.hasNext}
              hasPrevious={pagination?.hasPrevious}
              onPageChange={loadData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Viewings;
