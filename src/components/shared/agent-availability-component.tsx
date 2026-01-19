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
import { AgencyScheduleInterface } from "../../../utils/interfaces";
import { reformatDate } from "@/lib/utils";


type SelectedSlot = {
  date: string
  time: string
}

interface Props {
 // availability: Availability[]
  //onSelect: (slot: SelectedSlot) => void
  propertyId: string
}

export default function AgentAvailabilityPicker({
 // availability,
  propertyId
}: Props) {
  const [selected, setSelected] = useState<SelectedSlot | null>(null)
  const [availabilityId, setAvailabilityId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [medium, setMedium] = useState<string>("IN_PERSON");
  const [timeWindows, setTimeWindows] = useState<AgencyScheduleInterface[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (date: string, time: string) => {
    const slot = { date, time }
    setSelected(slot)
  }

  const getMaxDate = (date: string) => {
    if (!date) return ""
    const d = new Date(date)
    d.setDate(d.getDate() + 14)
    return d.toISOString().split("T")[0]
  }

  const handleInputChange = (value : string) => {
    setMedium(value);
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
                        <input type="radio" value={"IN_PERSON"} id="in_person" defaultChecked={true} name="radio" 
                        onChange={(e:any) => handleInputChange(e.target.value)}/>
                        <label htmlFor="in_person">IN_PERSON</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="radio" value={"VIRTUAL"} id="virtual" name="radio"
                        onChange={(e:any) => handleInputChange(e.target.value)}/>
                        <label htmlFor="virtual">VIRTUAL</label>
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
        propertyId={propertyId}
        medium={medium}
      />
    </div>
  )
}

type DialogProps = {
    isOpen : boolean;
    onClose : () => void;
    selected : SelectedSlot | null;
    availabilityWindowId : string;
    propertyId : string;
    medium :  string;
}

const BookViewingDialog = ({ isOpen, onClose, selected, availabilityWindowId, propertyId, medium }: DialogProps) => {
    const [loading, setLoading] = useState(false);

    const onBookHandler = async () => {
        setLoading(true);
        // booking logic here
        try{
            const bookingResponse = await axiosInstance.get(`agency-availability/verify-time-slot-availability/${availabilityWindowId}`);
            if(bookingResponse?.data?.success){
                if(medium === "IN_PERSON"){
                    await axiosInstance.post(`agent-property-viewing/in-person`, {
                        propertyId,
                        availabilityWindowId
                    }).then(response => {
                        if(response?.data?.success){
                            toast.success(response?.data?.message);
                            onClose();
                        }
                    }).catch(err => {
                        console.log({err});
                        setLoading(false);
                    })
                }else if(medium === "VIRTUAL"){
                    // initiate payment
                    try{
                        const initiatePaymentResponse = await axiosInstance.post('agent-property-viewing/virtual/initiate',{
                            propertyId,
                            availabilityWindowId
                        });
                        console.log({initiatePaymentResponse});
                    }catch(err : any){
                        toast.error(err?.response?.data?.message)
                    }
                    
                }
            }
            setLoading(false);
        }catch(error : any){
            console.error('Error verifying time slot availability:', error);
            toast.error(error?.response?.data?.message)
            setLoading(false);
        }
        
    }

    return(
        // dialog for booking viewing slot
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] bg-white" aria-describedby="">
                <DialogHeader>
                    <DialogTitle>
                        <p className="text-lg font-medium">Do you want to book a viewing for</p> 
                    </DialogTitle>
                </DialogHeader>

                <section className="text-base">

                    <p className="pt-3 pb-1 font-normal text-base"><span className="font-medium">Date</span> :
                     &nbsp;{selected?.date && format(reformatDate(selected?.date), "EEEE, MMMM d, yyyy")} 
                    </p>
                    <p className="py-1 font-normal text-base"><span className="font-medium">Time</span> : {selected?.time} </p>
                </section>

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

