"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios-interceptor";
import { addDays, addWeeks, format } from "date-fns";
import dynamic from "next/dynamic";
import { isUserLoggedIn } from "@/lib/utils";
import { ViewingMedium } from "@/lib/constants";
import { toast } from "sonner";
import { ConfirmVirtualViewing } from "./dialog-confirm-virtual-viewing";
import {
  parseDDMMYYYY,
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

interface VirtualViewingPaymentRecord {
  viewingId: string;
}

interface Props {
  propertyId: string;
  paymentReference?: string;
}

export default function AgentAvailabilityPicker({
  paymentReference,
  propertyId,
}: Props) {
  const [medium, setMedium] = useState<ViewingMedium>();
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

  useEffect(() => {
    if (propertyId && paymentReference) {
      finalizeVirtualViewing(paymentReference);
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
        const tempData: VirtualViewingPaymentRecord = {
          viewingId: result.data.id,
        };
        setLocalStorageField<VirtualViewingPaymentRecord>("vv_data", tempData);

        // Navigate the user to payment page for payment
        window.location.href = result.authorizationUrl;
      }
    } catch (error) {
      const errorMessage = "An error occurred";
      toast(errorMessage, {
        description: JSON.stringify(error),
      });
      throw error;
    }
  };

  const finalizeVirtualViewing = async (reference: string) => {
    const key = "vv_data";
    const viewingData = getLocalStorageField<VirtualViewingPaymentRecord>(key);
    if (!viewingData) {
      return;
    }
    const payload = {
      paymentReference: reference,
      viewingId: viewingData.viewingId,
    };

    try {
      const result = await confirmVirtualViewing(
        payload.paymentReference,
        payload.viewingId
      );
      if (result.success) {
        deleteLocalStorageField(key);
        const message = result.message ?? "Viewing confirmed successfully";
        toast(message);
      }
    } catch (error) {
      const errorMessage = "An error occurred";
      toast(errorMessage, {
        description: JSON.stringify(error),
      });
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
        const {
          data: { data },
        } = response;

        const dates = (data as any[]).map(({ date }) => ({
          date,
          formattedDate: parseDDMMYYYY(date).toLocaleDateString(),
        }));
        setAllSlots(data);
        setAvailableDates(dates);
      }
    } catch (error) {
    } finally {
      console.log("Finished fetching availability slots...");
    }
  };

  const selectViewingMedium = async (medium: ViewingMedium) => {
    setMedium(medium);
    if (!isUserLoggedIn()) {
      toast("Login before booking a viewing");
    }
    fetchViewingSlots(medium);
  };

  return (
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
              onClick={() => selectViewingMedium(ViewingMedium.IN_PERSON)}
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
              onClick={() => selectViewingMedium(ViewingMedium.VIRTUAL)}
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

        {medium && isUserLoggedIn() && (
          <>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Select Date
              </label>
              <select
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option defaultValue={""} selected disabled>
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
