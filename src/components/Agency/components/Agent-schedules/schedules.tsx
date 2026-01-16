'use client';
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Trash2,
  Check,
  X
} from "lucide-react";
import { axiosInstance } from "@/lib/axios-interceptor";
import { getLocalStorageFieldRaw } from "../../../../../utils/helpers";
import { ScheduleDialog } from "../Agent-viewings/dialogs/schedule-viewing";
import { AgencyScheduleInterface } from "../../../../../utils/interfaces";


const AgentSchedule = () => {
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  // const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<AgencyScheduleInterface[]>([] as AgencyScheduleInterface[]);
  const [timeSlotId , setTimeSlotId] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(false);

  // const handleTimeSlotToggle = (time: string) => {
  //   setSelectedTimeSlots(prev => 
  //     prev.includes(time) 
  //       ? prev.filter(t => t !== time)
  //       : [...prev, time]
  //   );
  // };

  // const handleSaveSchedule = () => {
  //   if (!selectedDate || selectedTimeSlots.length === 0) return;

  //   const existingScheduleIndex = schedules.findIndex(
  //     s => format(s.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  //   );

  //   const newTimeSlots: TimeSlot[] = selectedTimeSlots.map((time, index) => ({
  //     id: `${Date.now()}-${index}`,
  //     time,
  //     isAvailable: true
  //   }));

  //   if (existingScheduleIndex !== -1) {
  //     const updatedSchedules = [...schedules];
  //     const existingSlots = updatedSchedules[existingScheduleIndex].timeSlots;
  //     const existingTimes = existingSlots.map(s => s.time);
  //     const newSlots = newTimeSlots.filter(s => !existingTimes.includes(s.time));
  //     updatedSchedules[existingScheduleIndex].timeSlots = [...existingSlots, ...newSlots];
  //     setSchedules(updatedSchedules);
  //   } else {
  //     const newSchedule: Schedule = {
  //       id: Date.now().toString(),
  //       date: selectedDate,
  //       timeSlots: newTimeSlots
  //     };
  //     setSchedules(prev => [...prev, newSchedule]);
  //   }

  //   setSelectedTimeSlots([]);
  // };

  // const handleDeleteSchedule = (scheduleId: string) => {
  //   setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  // };

  // const handleRemoveTimeSlot = (scheduleId: string, slotId: string) => {
  //   setSchedules(prev => prev.map(schedule => {
  //     if (schedule.id === scheduleId) {
  //       const updatedSlots = schedule.timeSlots.filter(slot => slot.id !== slotId);
  //       return { ...schedule, timeSlots: updatedSlots };
  //     }
  //     return schedule;
  //   }).filter(schedule => schedule.timeSlots.length > 0));
  // };

  // const sortedSchedules = [...schedules].sort((a, b) => a.date.getTime() - b.date.getTime());

  // const scheduledDates = schedules.map(s => format(s.date, "yyyy-MM-dd"));
  const agencyId = getLocalStorageFieldRaw('agentId');
  
  useEffect(() => {
    async function getSchedules(){
      try{
        const schedules = await axiosInstance.get(`/agency-availability/open-windows/${agencyId}`);
         
          if(schedules?.data?.success){
            if(schedules?.data?.data?.length > 0){
              //const data = schedules?.data?.data;
                const formattedData = schedules?.data?.data?.map((s : AgencyScheduleInterface) =>{
                  const dateSplit = s.date?.split('/');
                  const reformattedDate = `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
                  return{
                    ...s,
                    date : reformattedDate
                  }
                  // new Date(reformattedDate).toLocaleDateString('en-us', {
                  //   weekday : 'long',
                  //   month : "short",
                  //   year : "numeric"
                  // })
                });
              setSchedules(formattedData);
              return
            }
            setSchedules([] as AgencyScheduleInterface[]);
            
          }
        } catch(err){
          console.log({err});
      }
    }
    getSchedules();
    
  },[refresh]);


  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Schedule</h1>
          <p className="text-muted-foreground pb-4">Set your availability for property viewings</p>
           <ScheduleDialog  refresh={setRefresh}/>
        </div>
       

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Days</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schedules.length}</div>
              <p className="text-xs text-muted-foreground">Days with availability</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {schedules?.reduce((acc, s) => acc + s?.openWindows?.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total time slots</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {schedules?.filter(s => new Date(s?.date) >= new Date()).length}
              </div>
              <p className="text-xs text-muted-foreground">Future schedules</p>
            </CardContent>
          </Card>
        </div>

        {/* <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="create">Create Schedule</TabsTrigger>
            <TabsTrigger value="view">View Schedules</TabsTrigger>
          </TabsList> */}

          {/* Create Schedule Tab */}
          {/* <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Select Date
                  </CardTitle>
                  <CardDescription>
                    Choose a date to set your availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        modifiers={{
                          scheduled: (date) => scheduledDates.includes(format(date, "yyyy-MM-dd"))
                        }}
                        modifiersStyles={{
                          scheduled: { 
                            backgroundColor: "hsl(var(--primary) / 0.1)",
                            borderRadius: "100%"
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  {selectedDate && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Selected: {format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                      {scheduledDates.includes(format(selectedDate, "yyyy-MM-dd")) && (
                        <p className="text-xs text-muted-foreground mt-1">
                          This date already has some time slots set
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card> 

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Select Time Slots
                  </CardTitle>
                  <CardDescription>
                    Choose your available time slots for the selected date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {defaultTimeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTimeSlots.includes(time) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTimeSlotToggle(time)}
                        className="text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>

                  {selectedTimeSlots.length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">
                        Selected: {selectedTimeSlots.length} slot(s)
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTimeSlots.sort().map((time) => (
                          <Badge key={time} variant="secondary" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSaveSchedule}
                    disabled={!selectedDate || selectedTimeSlots.length === 0}
                    className="w-full mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Save Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent> */}

          {/* View Schedules Tab */}
          {/* <TabsContent value="view" className="space-y-4"> */}
            {schedules?.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No schedules set</h3>
                  <p className="text-muted-foreground text-center">
                    Create your first schedule by selecting a date and time slots
                  </p>
                </CardContent>
              </Card>
            ) : (
              schedules?.map((schedule : AgencyScheduleInterface, index : number) => (
                <Card key={`schedule-${index}`} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <CalendarIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {format(schedule.date, "EEEE, MMMM d, yyyy")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {schedule?.openWindows?.length} time slot(s) available
                            </p>
                          </div>
                          <Badge 
                            className={new Date(schedule.date) >= new Date() ? "bg-green-800 text-white ml-auto py-2" : "bg-red-600 text-white ml-auto py-2"}
                          >
                            {new Date(schedule.date) >= new Date() ? "Upcoming" : "Past"}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {schedule?.openWindows?.map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full">
                                
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{slot?.timeSlot}</span>
                              <button
                                onClick={() => setTimeSlotId(slot.id)}
                                className="ml-1 text-muted-foreground hover:text-destructive transition-colors">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          {/* </TabsContent>
        </Tabs> */}
      </div>
    </div>
  );
};

export default AgentSchedule;