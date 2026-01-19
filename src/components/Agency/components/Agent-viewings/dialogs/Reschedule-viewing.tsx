'use client';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"
import { FC, useState } from "react";
import { AgencyScheduleInterface } from "../../../../../../utils/interfaces";


type Props = {
    schedules : AgencyScheduleInterface[]
}
export const RescheduleViewingDialog :FC<Props> = ({schedules}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSelectOnChange = (value : string) => {
        console.log({value});
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
             <DialogTrigger asChild >
                 <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Reschedule
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white" aria-describedby="">
                <DialogHeader>
                    <DialogTitle>Reschedule a Viewing</DialogTitle>
                </DialogHeader>
                <form >
                    {/* select here for choosing another time slot */}
                    <p>Select New Time Slot</p>
                     <Select onValueChange={handleSelectOnChange}>
                        <SelectTrigger className="w-full my-2">
                            <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>

                        <SelectContent>
                            {schedules.map((schedule, index) => schedule?.openWindows?.map((window : any) => {
                                //const value = `${schedule.date}|${window}`

                                return (
                                <SelectItem key={window?.id} value={window?.id}>
                                    <span className="font-medium">{schedule.date}</span>
                                    <span className="ml-2 text-muted-foreground">
                                        {window?.timeSlot}
                                    </span>
                                </SelectItem>
                                )
                            })
                            )}
                        </SelectContent>
                        </Select>
                    {/* textarea for the reason for a reschedule */}
                    <Textarea required placeholder="State your reason for Rescheduling" rows={4} className="w-full h-24 my-5">

                    </Textarea>
                
                    <DialogFooter>
                        <div className="flex justify-between items-center px-6 py-4 gap-4">
                            <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}>
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                className="w-fit disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={loading}>
                                Submit
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}