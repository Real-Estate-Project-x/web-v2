'use client';

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import clsx from "clsx"
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { axiosInstance } from "@/lib/axios-interceptor";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";

type Availability = {
  date: string
  openWindows: [
    {
        agencyId : string,
        date : string,
        dateCreated : string,
        dateUpdated : string,
        endDateTime:string,
        id:string,
        isBooked:boolean,
        startDateTime:string,
        status:boolean,
        timeSlot:string
    }
  ]
}

type SelectedSlot = {
  date: string
  time: string
}

interface Props {
 // availability: Availability[]
  onSelect: (slot: SelectedSlot) => void
  propertyId: string
}

export default function AgentAvailabilityPicker({
 // availability,
  onSelect,
  propertyId
}: Props) {
  const [selected, setSelected] = useState<SelectedSlot | null>(null)
  const [availabilityId, setAvailabilityId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [medium, setMedium] = useState<"IN_PERSON" | "VIRTUAL">("IN_PERSON");
  const [timeWindows, setTimeWindows] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (date: string, time: string) => {
    const slot = { date, time }
    setSelected(slot)
    onSelect(slot)
  }

  const getMaxDate = (date: string) => {
    if (!date) return ""
    const d = new Date(date)
    d.setDate(d.getDate() + 14)
    return d.toISOString().split("T")[0]
  }

  const onSubMitHandler = async (e : any) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await axiosInstance.post('/agency-availability/display-availability', 
        {
            propertyId,
            medium ,
            limitTo: {
            start: format(startDate, 'dd/MM/yyyy'),
            end: format(endDate, 'dd/MM/yyyy')
            }
        });

        if(response?.data?.success){
            setTimeWindows(response.data?.data);
            setLoading(false);
        }else{
            console.error('Failed to fetch availability');
            setLoading(false);
        }

    } catch (error) {
        console.error(error);

    }finally{
        setTimeout(() => {
            setLoading(false);
        }, 10000);
    }
  }

  console.log({timeWindows});


  return (
    <div className="space-y-4">
        <form onSubmit={onSubMitHandler}>
            <RadioGroup
            defaultValue="new"
            className="gap-6"
            name="propertyCondition">
                <div className="flex items-center gap-2">
                    <Label htmlFor="new">Select Mode of Viewing</Label>
                </div>
                <section className="flex items-center mb-4 gap-4">
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="IN_PERSON" id="new"  defaultChecked={true}
                        onChange={() => setMedium("IN_PERSON")}/>
                        <Label htmlFor="new">In Person</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="VIRTUAL" id="old" 
                         onChange={() => setMedium("VIRTUAL")}/>
                        <Label htmlFor="old">Virtual</Label>
                    </div>
                </section>
               
            </RadioGroup>

            <div className="flex flex-row gap-4 space-y-2">
                <div>
                    <p className="text-sm pb-2">Start&nbsp;Date</p>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>
                <div>
                    <p className="text-sm pb-2">End&nbsp;Date</p>
                    <input
                        type="date"
                        min={startDate}
                        max={getMaxDate(startDate)}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>
            </div>
           {/* <Calendar
            mode="single"
            selected={startDate}
            onSelect={setStartDate}
            disabled={(date) => {
                if (!startDate) return false

                const maxDate = addDays(startDate, 14)

                return (
                isBefore(date, startDate) ||
                isAfter(date, maxDate)
                )
            }} /> */}

            <Button type="submit" variant="default" className=" p-2 mt-2 w-56 disabled:bg-slate-300" disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
            </Button>
        </form>
        {timeWindows.length > 0 && (
            <h3 className="text-lg font-medium">Available Time Slots</h3>
        )}
        {timeWindows.length > 0 ? timeWindows?.map((day, index) => (
            <Card key={index} className="rounded-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                        {day.date}
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-wrap gap-2">
                    {day.openWindows.map((time, index) => {
                    const isActive =
                        selected?.date === day.date &&
                        selected?.time === time.timeSlot

                    return (
                        <Button
                        key={`${time}-${index}`}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() =>{ 
                            handleSelect(day.date, time.timeSlot);
                            setAvailabilityId(time.id);
                        }}
                        className={clsx(
                            "flex items-center gap-2 rounded-xl",
                            isActive && "shadow-md"
                        )}
                        >
                        <Clock className="h-4 w-4" />
                            {time.timeSlot}
                        </Button>
                    )
                    })}
                </CardContent>
            </Card>

        )) : (
            <p>No available slots. Please adjust your filters and try again.</p>
        )}

      {selected && (
        <Badge variant="secondary" className="text-sm">
          Selected : {selected.date} • {selected.time} 
        </Badge>
      )}
      <BookViewingDialog
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        selected={selected}
        availabilityWindowId={availabilityId}
      />
    </div>
  )
}

type DialogProps = {
    isOpen : boolean;
    onClose : () => void;
    selected : SelectedSlot | null;
    availabilityWindowId : string;
}

const BookViewingDialog = ({ isOpen, onClose, selected, availabilityWindowId }: DialogProps) => {
    const [loading, setLoading] = useState(false);

    const reformatDate = selected ?  selected?.date?.split('/')  : [];
    const reformattedDateString = reformatDate.length === 3 ? `${reformatDate[2]}-${reformatDate[1]}-${reformatDate[0]}` : '';

    const onBookHandler = async () => {
        setLoading(true);
        // booking logic here
        try{
            const bookingResponse = await axiosInstance.get(`agency-availability/verify-time-slot-availability/${availabilityWindowId}`);
            if(bookingResponse?.data?.success){
                toast.success(bookingResponse?.data?.message);
                onClose();
            }
            setLoading(false);
        }catch(error){
            console.error('Error verifying time slot availability:', error);
            setLoading(false);
        }
        
    }

    return(
        // dialog for booking viewing slot
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] bg-white">
                <DialogHeader>
                    <section className="text-base">
                        <p className="text-base font-normal">Do you want to book a viewing for</p> 

                        <p className="pt-3 pb-1 font-medium text-sm">{
                            new Date(reformattedDateString).toLocaleDateString('en-US', {
                                year: 'numeric',
                                weekday  :"long",
                                month : "short"
                            })
                        } </p>
                        <p className="py-1 font-medium text-sm">Time = {selected?.time} </p>
                    </section>
                </DialogHeader>

                <DialogFooter>
                    <Button type="button" className="w-full my-2 disabled:bg-slate-300 cursor-pointer" disabled={loading}
                    onClick={onBookHandler}>
                      { loading ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

