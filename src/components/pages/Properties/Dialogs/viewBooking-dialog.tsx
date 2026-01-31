'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axios-interceptor";
import { reformatDate } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "sonner";
import { getLocalStorageFieldRaw } from "../../../../../utils/helpers";
import { useRouter } from "next/navigation";
import { SelectedSlot } from "@/components/shared/agent-availability-component";

const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY as string;

type DialogProps = {
    isOpen : boolean;
    onCloseHandler : () => void;
    selected : SelectedSlot | null;
    availabilityWindowId : string;
    propertyId : string;
    medium :  string;
}

const BookViewingDialog = ({ isOpen, onCloseHandler, selected, availabilityWindowId, propertyId, medium }: DialogProps) => {
    const [loading, setLoading] = useState(false);

    const PaystackConfig = {
        reference: new Date().getTime().toString(),
        email: "chya11979@gmail.com",//getLocalStorageFieldRaw('email')  ?? "chya11979@gmail.com",
        amount: 2000 * 100, //parseInt(getLocalStorageFieldRaw('price') as string) ?? 2000 * 100 , // Paystack expects kobo
        publicKey : "sk_test_c506244775034a1b73b830814f3ca8e35d4d878b",
    };
    const router = useRouter();

    const onSuccess = async (reference: any) => {
        console.log("Payment successful:", reference);
        //you can call your backend here to verify payment
       try {
        const paymentConfirmationResponse = await axiosInstance.post(`/agent-property-viewing/virtual/confirm`,{
            viewingId : getLocalStorageFieldRaw("viewingId") as string,
            paymentReference : reference?.trxref
        });
        console.log({paymentConfirmationResponse});
        if(paymentConfirmationResponse?.data?.success){
            toast.success(paymentConfirmationResponse?.data?.message);
        }
        } catch (error : any) {
            console.log({error});
            toast.error("Payment Did not go through",{description : error?.response?.data?.message});
        }finally{
            localStorage.removeItem("viewingId");
            //localStorage.removeItem("payRef");
        }
    };

    const onClose = () => {
        console.log("Payment closed");
    };

    const initializePayment = usePaystackPayment(PaystackConfig);

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
                            onCloseHandler();
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
                        if(initiatePaymentResponse?.data?.success){
                            //const paystackUrl =  initiatePaymentResponse?.data?.authorizationUrl;
                            const ViewingId = initiatePaymentResponse?.data?.data?.id;
                            //const paymentReference = initiatePaymentResponse?.data?.data?.paymentReference;
                            localStorage.setItem('viewingId',ViewingId );
                            //localStorage.setItem("payRef", paymentReference);
                           // localStorage.setItem("price", initiatePaymentResponse?.data?.data?.price);

                           // router.replace(paystackUrl);
                            // values to confirm payment
                            initializePayment({onSuccess, onClose})
                            
                        }
                    }catch(err : any){
                        console.log({virtualErr : err});
                        toast.error(err?.message, {description : err?.issues?.[0]?.message})
                    }
                    
                }
            }
            setLoading(false);
        }catch(error : any){
            toast.error(error?.response?.data?.message)
            setLoading(false);
        }
        
    }

    return(
        // dialog for booking viewing slot
        <Dialog open={isOpen} onOpenChange={onCloseHandler}>
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

export default BookViewingDialog;
