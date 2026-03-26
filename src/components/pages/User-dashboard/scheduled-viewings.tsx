"use client";

import { useEffect, useState } from "react";
import { ScheduledViewing } from "@/components/shared";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ApiRequests } from "@/lib/api.request";
import { PaginationControlInterface } from "../../../../utils/interfaces";

export const DashboardSchedule = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewings, setViewings] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );

  const fetchViewings = async (pageNumber = 1, pageSize = 10) => {
    setIsLoading(true);

    try {
      const response = await new ApiRequests().fetchCustomerViewingSchedule(
        pageNumber,
        pageSize
      );
      if (response.success) {
        const { data, paginationControl } = response;
        setViewings(data);
        setPagination(paginationControl);
        setIsLoading(false);
      }
    } catch (error) {
      throw error;
    }
  };

  const loadData = async (page = 1) => {
    await fetchViewings(page);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Scheduled Viewings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Viewings</CardTitle>
            <CardDescription>Your scheduled property viewings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScheduledViewing
                property="123 Main Street"
                date="2025-05-01"
                time="14:00"
                agent="John Smith"
              />
              <ScheduledViewing
                property="456 Oak Avenue"
                date="2025-05-03"
                time="10:30"
                agent="Sarah Johnson"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Past Viewings</CardTitle>
            <CardDescription>
              Properties you&apos;ve already visited
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScheduledViewing
                property="789 Pine Road"
                date="2025-04-25"
                time="15:00"
                agent="Michael Brown"
                isPast
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
