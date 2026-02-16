"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import clsx from "clsx";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import { axiosInstance } from "@/lib/axios-interceptor";
import { addDays, addWeeks, format } from "date-fns";
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
import { ViewingMedium } from "@/lib/constants";
import { toast } from "sonner";
import { ConfirmVirtualViewing } from "./dialog-confirm-virtual-viewing";
import {
  deleteLocalStorageField,
  getLocalStorageField,
  setLocalStorageField,
} from "../../../utils/helpers";
// just importing the propertyMap component led to window not defined issues because it was running on the server b4 the window was up
// using use client specified client component not server but importing dynamically and disabling ssr makes the component wait until window is up b4 running
// voila problem solved

const BookViewingDialog = dynamic(
  () => import("../pages/Properties/Dialogs/viewBooking-dialog"),
  { ssr: false }
);

export type SelectedSlot = {
  date: string;
  time: string;
};

interface Props {
  propertyId: string;
}

export default function AgentAvailabilityPicker({
  // availability,
  propertyId,
}: Props) {
  const [selected, setSelected] = useState<SelectedSlot | null>(null);
  const [availabilityId, setAvailabilityId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [medium, setMedium] = useState<ViewingMedium>(ViewingMedium.IN_PERSON);
  const [timeWindows, setTimeWindows] = useState<AgencyScheduleInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorObj] = useState<{ msg: string; flag: boolean }>({
    msg: "",
    flag: false,
  });

  const [availableDates, setAvailableDates] = useState<
    {
      date: string;
      formattedDate: string;
    }[]
  >([]);
  const [allSlots, setAllSlots] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [virtualViewingFee, setVirtualViewingFee] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  //   const handleSelect = (date: string, time: string) => {
  //     const slot = { date, time };
  //     setSelected(slot);
  //   };

  //   const getMaxDate = (date: string) => {
  //     if (!date) return "";
  //     const d = new Date(date);
  //     d.setDate(d.getDate() + 14);
  //     return d.toISOString().split("T")[0];
  //   };

  //   const handleInputChange = (value: ViewingMedium) => {
  //     setMedium(value);
  //   };

  useEffect(() => {
    if (propertyId) {
      fetchViewingSlots();
      finalizeVirtualViewing();
    }
  }, []);

  const submitViewingRequest = async () => {
    try {
      if (medium === ViewingMedium.IN_PERSON) {
        const result = await submitInPersonViewing(selectedTimeSlot);
        if (result?.success) {
          resetForm();
          toast(result.message, {});
        }
      } else {
        // Virtual viewing
        // => Get fee for virtual viewing
        const virtualViewingFee = await fetchVirtualViewingFee();
        if (virtualViewingFee) {
          setVirtualViewingFee(virtualViewingFee.data);
        }
        // => [Open modal to display cost of virtual viewing & confirm user go ahead]
        setIsModalOpen(true);
      }
    } catch (error) {
      const errorMessage = "An error occurred";
      toast(errorMessage, {
        description: JSON.stringify(error),
      });
      throw error;
    }
  };

  const fetchVirtualViewingFee = async () => {
    const feeType = "VIRTUAL_PROPERTY_VIEWING_FEE";
    const url = `/fee-setup/${feeType}`;
    try {
      const result = await axiosInstance.get(url);
      if (result.data?.success) {
        return result.data;
      }
    } catch (error) {}
  };

  const initiateVirtualViewing = async () => {
    setIsModalOpen(false);

    try {
      const result = await submitVirtualViewing(selectedTimeSlot);
      if (result) {
        // Navigate the user to payment page for payment
        window.location.href = result.authorizationUrl;

        const tempData = {
          viewingId: selectedTimeSlot,
          authorizationUrl: result.authorizationUrl,
          reference: result.paymentReference,
        };
        setLocalStorageField("vv_data", tempData);
        console.log({ tempData });
      }
    } catch (error) {
      const errorMessage = "An error occurred";
      toast(errorMessage, {
        description: JSON.stringify(error),
      });
      throw error;
    }
  };

  const finalizeVirtualViewing = async () => {
    const key = "vv_data";
    const viewingData = getLocalStorageField(key);
    if (!viewingData) {
      return;
    }
    const payload = {
      viewingId: viewingData.viewingId,
      paymentReference: viewingData.reference,
    };

    try {
      const result = await confirmVirtualViewing(
        payload.paymentReference,
        payload.viewingId
      );
      if (result.success) {
        deleteLocalStorageField(key);
        toast(result.message, {});
      }
    } catch (error) {
      throw error;
    }
  };

  const resetForm = () => {
    setAvailableDates([]);
    setAllSlots([]);
    setSelectedDate("");
    setSelectedTimeSlot("");
  };

  const submitVirtualViewing = async (selectedTimeSlot: string) => {
    const url = "/agent-property-viewing/virtual/initiate";
    const payload = {
      propertyId,
      availabilityWindowId: selectedTimeSlot,
    };
    try {
      const response = await axiosInstance.post(url, payload);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const confirmVirtualViewing = async (
    reference: string,
    viewingId: string
  ) => {
    const url = "/agent-property-viewing/virtual/confirm";

    try {
      const response = await axiosInstance.post(url, {
        viewingId,
        paymentReference: reference,
      });
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const submitInPersonViewing = async (selectedTimeSlot: string) => {
    const url = "/agent-property-viewing/in-person";
    const payload = {
      propertyId,
      availabilityWindowId: selectedTimeSlot,
    };
    try {
      const response = await axiosInstance.post(url, payload);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchViewingSlots = async (medium = ViewingMedium.IN_PERSON) => {
    const startDate = addDays(new Date(), 1);
    const endDate = addWeeks(startDate, 2);
    const url = "/agency-availability/display-availability";
    const payload = {
      propertyId,
      medium,
      limitTo: {
        start: format(startDate, "MM/dd/yyyy"),
        end: format(endDate, "MM/dd/yyyy"),
      },
      //////// => Load availability records to db
    };

    try {
      const response = await axiosInstance.post(url, payload);
      if (response.data?.success) {
        // const {
        //   data: { data },
        // } = response;

        const data = [
          {
            date: "11/14/2026",
            openWindows: [
              {
                id: "3f9c1a42-7b6e-4d8f-9a21-5c7e2b8f4d91",
                status: true,
                date: "11/14/2026",
                timeSlot: "8:00am - 9:00am",
              },
              {
                id: "a7d4e6b9-2c13-4f5a-8e90-1b3c7d9f2a64",
                status: true,
                date: "11/14/2026",
                timeSlot: "9:00am - 10:00am",
              },
              {
                id: "9c2f7e41-5a8b-4c6d-b193-7e2a4f8c1d50",
                status: true,
                date: "11/14/2026",
                timeSlot: "10:00am - 11:00am",
              },
              {
                id: "d1a7c9f3-8b42-4e6d-9f05-2c7a1e4b8d63",
                status: true,
                date: "11/14/2026",
                timeSlot: "11:00am - 12:00pm",
              },
            ],
          },
          {
            date: "11/15/2026",
            openWindows: [
              {
                id: "6e4b1d92-3f7a-4c8e-a519-9d2b6f1c7e80",
                status: true,
                date: "11/15/2026",
                timeSlot: "8:00am - 9:00am",
              },
              {
                id: "b8f2c6a1-9d43-4e7b-8a15-3c6e9f2d4a71",
                status: true,
                date: "11/15/2026",
                timeSlot: "9:00am - 10:00am",
              },
              {
                id: "4a7e2c9d-1b6f-4d8a-b352-6f9c1e4d7a28",
                status: true,
                date: "11/15/2026",
                timeSlot: "10:00am - 11:00am",
              },
              {
                id: "c5d9a2f7-3e81-4b6c-9a40-7e1d3f8b2c65",
                status: true,
                date: "11/15/2026",
                timeSlot: "11:00am - 12:00pm",
              },
            ],
          },
        ];

        // Set all available dates to list
        const dates = (data as any[]).map(({ date }) => ({
          date,
          formattedDate: new Date(date).toLocaleDateString(),
        }));
        setAllSlots(data);
        setAvailableDates(dates);
      }
    } catch (error) {
    } finally {
      console.log("Finished fetching availability slots...");
    }
  };

  //   const onSubMitHandler = async (e: any) => {
  //     e.preventDefault();
  //     if (isUserLoggedIn()) {
  //       setLoading(true);
  //       try {
  //         const response = await axiosInstance.post(
  //           "/agency-availability/display-availability",
  //           {
  //             propertyId,
  //             medium,
  //             limitTo: {
  //               start: format(startDate, "dd/MM/yyyy"),
  //               end: format(endDate, "dd/MM/yyyy"),
  //             },
  //           }
  //         );

  //         if (response?.data?.success) {
  //           setTimeWindows(response.data?.data);
  //           setLoading(false);
  //         }
  //       } catch (err: any) {
  //         //console.error(err);
  //         setErrorObj({
  //           ...errorMsg,
  //           flag: true,
  //           msg: err?.response?.data?.message.includes(
  //             "Field limitTo.start must be in the future"
  //           )
  //             ? "All dates must be in the Future"
  //             : err?.response?.data?.message,
  //         });
  //       } finally {
  //         setTimeout(() => {
  //           setLoading(false);
  //         }, 5000);
  //       }
  //     } else {
  //       setErrorObj({
  //         ...errorMsg,
  //         flag: true,
  //         msg: "Sign-In First to Schedule a Viewing",
  //       });
  //     }
  //   };

  return (
    // <div className="bg-white h-fit p-6 rounded-lg shadow-sm border mt-8">
    //   <h2 className="text-xl font-semibold mb-4">Request a Tour</h2>

    //   <div className="space-y-4">
    //     <form onSubmit={onSubMitHandler}>
    //       <RadioGroup
    //         defaultValue="new"
    //         className="gap-6"
    //         name="propertyCondition"
    //       >
    //         <section className="flex items-center mb-4 gap-4">
    //           <Label htmlFor="new" className="text-gray-500">
    //             Do you wish to view this property :
    //           </Label>
    //           <div className="flex items-center gap-2">
    //             <input
    //               type="radio"
    //               value={"IN_PERSON"}
    //               id="in_person"
    //               defaultChecked={true}
    //               name="radio"
    //               onChange={(e: any) => handleInputChange(e.target.value)}
    //             />
    //             <label htmlFor="in_person">IN_PERSON&nbsp;?</label>
    //           </div>
    //           <div className="flex items-center gap-2">
    //             <input
    //               type="radio"
    //               value={"VIRTUAL"}
    //               id="virtual"
    //               name="radio"
    //               onChange={(e: any) => handleInputChange(e.target.value)}
    //             />
    //             <label htmlFor="virtual">VIRTUALLY&nbsp;?</label>
    //           </div>
    //         </section>
    //       </RadioGroup>

    //       <div className="flex flex-row gap-4 space-y-2">
    //         <div>
    //           <p className="text-sm pb-2">Start&nbsp;Date</p>
    //           <input
    //             type="date"
    //             value={startDate}
    //             onChange={(e) => setStartDate(e.target.value)}
    //             className="border rounded p-2"
    //           />
    //         </div>
    //         <div>
    //           <p className="text-sm pb-2">End&nbsp;Date</p>
    //           <input
    //             type="date"
    //             min={startDate}
    //             max={getMaxDate(startDate)}
    //             onChange={(e) => setEndDate(e.target.value)}
    //             className="border rounded p-2"
    //           />
    //         </div>
    //       </div>

    //       <Button
    //         type="submit"
    //         variant="default"
    //         className=" p-2 mt-2 w-56 disabled:bg-slate-300"
    //         disabled={loading}
    //       >
    //         {loading ? "Loading..." : "Submit"}
    //       </Button>
    //     </form>
    //     {timeWindows.length > 0 && (
    //       <h3 className="text-lg font-medium">Available Time Slots</h3>
    //     )}
    //     {timeWindows.length > 0 ? (
    //       timeWindows?.map((day, index) => (
    //         <Card key={index} className="rounded-2xl">
    //           <CardHeader className="pb-2">
    //             <CardTitle className="text-sm font-semibold text-muted-foreground">
    //               {day.date}
    //             </CardTitle>
    //           </CardHeader>

    //           <CardContent className="flex flex-wrap gap-2">
    //             {day.openWindows.map((time, index) => {
    //               const isActive =
    //                 selected?.date === day.date &&
    //                 selected?.time === time.timeSlot;

    //               return (
    //                 <Button
    //                   key={`${time}-${index}`}
    //                   variant={isActive ? "default" : "outline"}
    //                   size="sm"
    //                   onClick={() => {
    //                     handleSelect(day.date, time.timeSlot);
    //                     setAvailabilityId(time.id);
    //                   }}
    //                   className={clsx(
    //                     "flex items-center gap-2 rounded-xl",
    //                     isActive && "shadow-md"
    //                   )}
    //                 >
    //                   <Clock className="h-4 w-4" />
    //                   {time.timeSlot}
    //                 </Button>
    //               );
    //             })}
    //           </CardContent>
    //         </Card>
    //       ))
    //     ) : (
    //       <p>
    //         {!medium || !startDate || !endDate
    //           ? ""
    //           : "No available slots. Please adjust your filters and try again."}
    //       </p>
    //     )}

    //     {selected && (
    //       <Badge variant="secondary" className="text-sm">
    //         Selected : {selected.date} • {selected.time}
    //       </Badge>
    //     )}
    //     <BookViewingDialog
    //       isOpen={selected !== null}
    //       onCloseHandler={() => setSelected(null)}
    //       selected={selected}
    //       availabilityWindowId={availabilityId}
    //       propertyId={propertyId}
    //       medium={medium}
    //     />
    //   </div>
    //   <ErrorDialog
    //     open={errorMsg.flag}
    //     onOpenChange={() => setErrorObj({ ...errorMsg, msg: "", flag: false })}
    //     description={errorMsg.msg}
    //   />
    // </div>
    <div className="flex items-center justify-center pt-10 pb-10">
      {/* Modal to confirm virtual_viewing */}
      {isModalOpen && virtualViewingFee && (
        <ConfirmVirtualViewing
          isOpen={isModalOpen}
          virtualViewingFee={virtualViewingFee}
          onClose={() => setIsModalOpen(false)}
          onProceed={initiateVirtualViewing}
        />
      )}

      <div className="bg-white w-full max-w-12xl rounded-2xl shadow-lg p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Request a Property Viewing
          </h2>
          <p className="text-gray-500 text-sm">
            Choose your preferred viewing type and select an available time
            slot.
          </p>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-3">
            Select Viewing Type
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label
              onClick={() => {
                setMedium(ViewingMedium.IN_PERSON);
                fetchViewingSlots(ViewingMedium.IN_PERSON);
              }}
              className="border rounded-xl p-4 cursor-pointer hover:border-blue-500 transition"
            >
              <input
                type="radio"
                name="viewing_type"
                value="in_person"
                className="hidden peer"
              />
              <div
                className={`border rounded-xl p-3 text-center ${
                  medium === "IN_PERSON" ? "border-blue-600 bg-blue-50" : ""
                }`}
              >
                <p className="font-semibold text-gray-800">🏠 In Person</p>
                <p className="text-sm text-gray-500">
                  Visit the property physically
                </p>
              </div>
            </label>

            <label
              onClick={() => {
                setMedium(ViewingMedium.VIRTUAL);
                fetchViewingSlots(ViewingMedium.VIRTUAL);
              }}
              className="border rounded-xl p-4 cursor-pointer hover:border-blue-500 transition"
            >
              <input
                type="radio"
                name="viewing_type"
                value="virtual"
                className="hidden peer"
              />
              <div
                className={`border rounded-xl p-3 text-center ${
                  medium === "VIRTUAL" ? "bg-blue-50 border-blue-600" : ""
                }`}
              >
                <p className="font-semibold text-gray-800">💻 Virtual Tour</p>
                <p className="text-sm text-gray-500">View via video call</p>
              </div>
            </label>
          </div>
        </div>

        {medium && (
          <>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Select Date
              </label>
              <select
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option selected disabled>
                  Select available date
                </option>
                {availableDates.map(({ date, formattedDate }) => (
                  <option key={date} value={date}>
                    {formattedDate}
                  </option>
                ))}
              </select>
            </div>

            {selectedDate && (
              <>
                <div>
                  <label className="block font-semibold text-gray-700 mb-3">
                    Select Time Slot
                  </label>

                  <div className="grid grid-cols-4 gap-3">
                    {(
                      allSlots.find(({ date }: any) => date === selectedDate)
                        .openWindows as any[]
                    ).map(({ id, timeSlot }) => (
                      <button
                        key={id}
                        onClick={() => setSelectedTimeSlot(id)}
                        type="button"
                        className={`border rounded-xl py-3 hover:bg-blue-50 hover:border-blue-600 transition ${
                          selectedTimeSlot === id
                            ? "bg-blue-50 border-blue-600"
                            : ""
                        }`}
                      >
                        {timeSlot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={submitViewingRequest}
                    disabled={selectedTimeSlot ? false : true}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Submit Viewing Request
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
