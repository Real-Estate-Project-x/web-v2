"use client";

import { toast } from "sonner";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { axiosInstance } from "@/lib/axios-interceptor";

const TIME_WINDOWS = [
  "7:00am - 8:00am",
  "8:00am - 9:00am",
  "9:00am - 10:00am",
  "10:00am - 11:00am",
  "11:00am - 12:00pm",
  "12:00pm - 1:00pm",
  "1:00pm - 2:00pm",
  "2:00pm - 3:00pm",
  "3:00pm - 4:00pm",
  "4:00pm - 5:00pm",
  "5:00pm - 6:00pm",
  "6:00pm - 7:00pm",
  "7:00pm - 8:00pm",
];

type Props = {
  refresh: React.Dispatch<React.SetStateAction<boolean>>;
};
export function ScheduleDialog({ refresh }: Props) {
  const [schedule, setSchedule] = useState<
    { date: string; openWindows: string[] }[]
  >([{ date: "", openWindows: [] }]);
  const [hours, setHours] = useState<string[]>(TIME_WINDOWS);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const updateWindow = (index: number, window: string, checked: boolean) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              openWindows: checked
                ? [...item.openWindows, window]
                : item.openWindows.filter((w) => w !== window),
            }
          : item
      )
    );
  };

  const getAvailabilityHours = async () => {
    try {
      const response = await axiosInstance.get(
        "agency-availability/generate-hourly-windows"
      );
      setHours(response.data.data);
    } catch (err) {
      console.error("Error fetching availability hours:", err);
    }
  };

  const onSubmitSetSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedSchedule = schedule.map((item) => ({
      date: format(new Date(item.date), "yyyy-MM-dd"),
      openWindows: item.openWindows,
    }));

    try {
      const response = await axiosInstance.post("agency-availability", {
        schedule: formattedSchedule,
      });
      if (response.data.success) {
        toast.success("Schedule submitted successfully");
        setLoading(false);
        setOpen(false);
        setSchedule([{ date: "", openWindows: [] }]);
        refresh(true);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error submitting schedule");
      setLoading(false);
      // console.error("Error submitting schedule:", err);
    }
  };

  useEffect(() => {
    getAvailabilityHours();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Set Schedule</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl w-full bg-white h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Viewing Schedule</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {schedule.map((item, index) => (
            <div key={index} className="space-y-3 rounded-lg border p-3">
              {/* Date */}
              <div className="space-y-1">
                <Label>Date</Label>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={item.date}
                  onChange={(e) =>
                    setSchedule((prev) =>
                      prev.map((s, i) =>
                        i === index ? { ...s, date: e.target.value } : s
                      )
                    )
                  }
                />
              </div>

              {/* Time windows */}
              <Label>Select available time Slots</Label>
              <div className="space-y-2 grid grid-cols-3 gap-1">
                {hours?.map((window) => (
                  <div key={window} className="flex items-center gap-2 mt-4">
                    <Checkbox
                      checked={item.openWindows.includes(window)}
                      onCheckedChange={(checked) =>
                        updateWindow(index, window, Boolean(checked))
                      }
                    />
                    <Label>{window}</Label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button
            variant="secondary"
            onClick={() =>
              setSchedule((prev) => [...prev, { date: "", openWindows: [] }])
            }
          >
            Add Another Date
          </Button>

          <Button
            className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={onSubmitSetSchedule}
            disabled={loading}
          >
            Save Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
