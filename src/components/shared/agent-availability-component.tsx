'use client';

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import clsx from "clsx"
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import { axiosInstance } from "@/lib/axios-interceptor";
import { format } from "date-fns";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
// import { toast } from "sonner";
import { AgencyScheduleInterface } from "../../../utils/interfaces";
//import { BookViewingDialog } from "../pages/Properties/Dialogs/viewBooking-dialog";
// import { reformatDate } from "@/lib/utils";
// import { useRouter } from "next/navigation";
// import { usePaystackPayment } from "react-paystack";
// import { getLocalStorageFieldRaw } from "../../../utils/helpers";

import dynamic from "next/dynamic";
import { ErrorDialog } from "./error-dialog";
import { isUserLoggedIn } from "@/lib/utils";
// just importing the propertyMap component led to window not defined issues because it was running on the server b4 the window was up
// using use client specified client component not server but importing dynamically and disabling ssr makes the component wait until window is up b4 running
// voila problem solved

const BookViewingDialog = dynamic(
  () => import("../pages/Properties/Dialogs/viewBooking-dialog"),
  {ssr : false}
);

export type SelectedSlot = {
  date: string
  time: string
}

interface Props {
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
  const [errorMsg, setErrorObj] = useState<{ msg: string; flag: boolean }>({
      msg: "",
      flag: false});

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
    if(isUserLoggedIn()){
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
            }

        } catch (err : any) {
            //console.error(err);
            setErrorObj({
            ...errorMsg,
            flag: true,
            msg: err?.response?.data?.message.includes(
                "Field limitTo.start must be in the future"
            )
                ? "All dates must be in the Future"
                : err?.response?.data?.message,
            });
            

        }finally{
            setTimeout(() => {
                setLoading(false);
            }, 5000);
        }
    }else{
        setErrorObj({
        ...errorMsg,
        flag: true,
        msg: "Sign-In First to Schedule a Viewing" });
    }
    
  }

  return (
    <div className="bg-white h-fit p-6 rounded-lg shadow-sm border mt-8">
        <h2 className="text-xl font-semibold mb-4">Request a Tour</h2>
        <div className="space-y-4">
            <form onSubmit={onSubMitHandler}>
                <RadioGroup
                defaultValue="new"
                className="gap-6"
                name="propertyCondition">
                    <section className="flex items-center mb-4 gap-4">
                        <Label htmlFor="new" className="text-gray-500">Do you wish to view this property :</Label>
                        <div className="flex items-center gap-2">
                            <input type="radio" value={"IN_PERSON"} id="in_person" defaultChecked={true} name="radio" 
                            onChange={(e:any) => handleInputChange(e.target.value)}/>
                            <label htmlFor="in_person">IN_PERSON&nbsp;?</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="radio" value={"VIRTUAL"} id="virtual" name="radio"
                            onChange={(e:any) => handleInputChange(e.target.value)}/>
                            <label htmlFor="virtual">VIRTUALLY&nbsp;?</label>
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
                <p>{(!medium || !startDate || !endDate) ? "" :"No available slots. Please adjust your filters and try again."}</p>
            )}

        {selected && (
            <Badge variant="secondary" className="text-sm">
            Selected : {selected.date} • {selected.time} 
            </Badge>
        )}
        <BookViewingDialog
            isOpen={selected !== null}
            onCloseHandler={() => setSelected(null)}
            selected={selected}
            availabilityWindowId={availabilityId}
            propertyId={propertyId}
            medium={medium}
        />
        </div>
        <ErrorDialog
        open={errorMsg.flag}
        onOpenChange={() =>
            setErrorObj({ ...errorMsg, msg: "", flag: false })
        }
        description={errorMsg.msg}
        />
    </div>
  )
}

