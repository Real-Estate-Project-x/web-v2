'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, ThumbsDown, ThumbsDownIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { axiosInstance } from "@/lib/axios-interceptor";

interface ReportPropertyProp {
  propertyId: string;
  agencyId : string;
}

const ReportModal = ({propertyId, agencyId }: ReportPropertyProp) => {
  const [ loading, setLoader] = useState<boolean>(false);
  const [ isOpen, setOpen] = useState(false);

  const [report, setReport] = useState({
    subject : "",
    comment : ""
  });

  const onClose = () => {
    setOpen(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    // api her for report 
    try {
        const response = await axiosInstance.post(`/report`,
        {
            type : "AGENCY",
            agencyId,
            propertyId,
            subject: report.subject,
            report: report.comment
        });
        if(response?.data?.success){
            toast.success(response?.data?.message);
            setTimeout(() => {
                onClose();
                setLoader(false);
            }, 3000);

        }else{
            toast.error(response?.data?.message);
        }
    } catch (error : any) {
        toast.error(error?.response?.data?.message);
    }finally{
        setLoader(false);
    }

    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant={'destructive'} onClick={() => setOpen(true)}>
                Report 
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] bg-white">
            <DialogHeader>
            <DialogTitle className="text-center">
                <p className="pt-2 text-xl"> Report Property</p>    
            </DialogTitle>
            <DialogDescription className="flex justify-center mt-4 mb-2">
                <ThumbsDown/>
            </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    
                    <Input
                    type="text"
                    placeholder="Enter Subject"
                    value={report.subject}
                    onChange={(e) => setReport({...report, subject :e.target.value})}
                    required
                    />
                </div>
                <div>
                    <Textarea
                    placeholder="Your Reason for Reporting this Property"
                    value={report.comment}
                    onChange={(e) => setReport({...report, comment : e.target.value})}
                    required
                    className="min-h-[100px]"
                    />
                </div>
                <DialogFooter className="flex justify-end items-center gap-4">
                    <Button type="button" variant={'outline'} className="w-fit"
                    onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" className="w-fit disabled:bg-opacity-50 disabled:cursor-default" disabled={loading}>
                        Submit
                    </Button>
                </DialogFooter>
            </form>
            
        </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
