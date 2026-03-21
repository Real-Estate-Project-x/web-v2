"use client";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { PropertyUpFor } from "@/lib/constants";
import { ApiRequests } from "@/lib/api.request";
import { BasicStep } from "./components/basic-step";
import { MediaStep } from "./components/media-step";
import { DetailsStep } from "./components/details-step";
import { AmenitiesStep } from "./components/amenties-step";
import {
  cleanObject,
  getLocalStorageFieldRaw,
} from "../../../../../utils/helpers";

const steps = ["Basic", "Details", "Amenities", "Media"];

export const CreateProperty = ({}) => {
  const [step, setStep] = useState(0);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [addressesList, setAddressesList] = useState<any[]>([]);

  const [form, setForm] = useState({
    // Basic
    propertyTypeId: "",
    title: "",
    address: "",
    stateId: "",
    description: "",
    upFor: PropertyUpFor.SALE,
    propertyCategory: "",
    geoCoordinates: {
      latitude: undefined as number | undefined,
      longitude: undefined as number | undefined,
    },

    // Details
    price: undefined as number | undefined,
    paymentCoverageDuration: "YEARLY",
    agencyId: "",
    sizeInSquareFeet: undefined as number | undefined,
    additionalCosts: [
      { title: "Agency Fee", price: undefined as number | undefined },
    ],
    averageBroadbandSpeedInMegabytes: undefined as number | undefined,
    noOfBedrooms: undefined as number | undefined,
    noOfToilets: undefined as number | undefined,
    noOfKitchens: undefined as number | undefined,

    // amenities
    hasLaundry: false,
    hasWifi: false,
    hasCarParking: false,
    hasKidsPlayArea: false,
    hasCctv: false,
    hasGym: false,
    isNewBuilding: false,

    // media
    videoId: "",
    photoIds: [],
    architecturalPlanIds: [],
  });

  const fetchPropertyTypes = async () => {
    const result = await new ApiRequests().fetchPropertyTypes(
      "success,data(id,name,status,tag)"
    );
    if (!result) return;

    setPropertyTypes(result.data);
  };

  const resetForm = () => {
    setStep(0);
    setForm({
      // Basic
      propertyTypeId: "",
      title: "",
      address: "",
      stateId: "",
      description: "",
      upFor: PropertyUpFor.SALE,
      propertyCategory: "",
      geoCoordinates: {
        latitude: undefined as number | undefined,
        longitude: undefined as number | undefined,
      },

      // Details
      price: undefined as number | undefined,
      paymentCoverageDuration: "YEARLY",
      agencyId: "",
      sizeInSquareFeet: undefined as number | undefined,
      additionalCosts: [
        { title: "Agency Fee", price: undefined as number | undefined },
      ],
      averageBroadbandSpeedInMegabytes: undefined as number | undefined,
      noOfBedrooms: undefined as number | undefined,
      noOfToilets: undefined as number | undefined,
      noOfKitchens: undefined as number | undefined,

      // amenities
      hasLaundry: false,
      hasWifi: false,
      hasCarParking: false,
      hasKidsPlayArea: false,
      hasCctv: false,
      hasGym: false,
      isNewBuilding: false,

      // media
      videoId: "",
      photoIds: [],
      architecturalPlanIds: [],
    });
  };

  useEffect(() => {
    fetchPropertyTypes();

    // Pre_set agencyId into form_data
    update("agencyId", getLocalStorageFieldRaw("agentId"));
  }, []);

  const update = (key: string, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      console.log({ form: updated });
      return updated;
    });
  };

  const handleOnAddressSelection = async (stateName: string) => {
    const state = await new ApiRequests().fetchStateByName(
      stateName,
      "success,data(id,code,name,capital)"
    );
    update("stateId", state.data.id);
  };

  const handleOnAddressAutocomplete = async (address: string) => {
    if (!address) return;

    try {
      const result = await new ApiRequests().addressAutocompletion(address);
      if (result) {
        setAddressesList(result);
      }
    } catch (error) {
      let message = "An error occurred";
      if (error instanceof AxiosError) {
        message = error.message;
      }
      toast(message, { description: JSON.stringify(error) });
      throw error;
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clean_data and remove null/undefined values
    const payload = cleanObject(form);

    // Cast numbers from strings before making request
    const castedPayload = {
      ...payload,
      ...(payload.price && {
        price: +payload.price,
      }),
      ...(payload.sizeInSquareFeet && {
        sizeInSquareFeet: +payload.sizeInSquareFeet,
      }),
      ...(payload.noOfBedrooms && {
        noOfBedrooms: +payload.noOfBedrooms,
      }),
      ...(payload.noOfToilets && {
        noOfToilets: +payload.noOfToilets,
      }),
      ...(payload.noOfKitchens && {
        noOfKitchens: +payload.noOfKitchens,
      }),
      ...(payload.additionalCosts && {
        additionalCosts: (payload.additionalCosts as any[]).map((fee) => ({
          ...fee,
          price: +fee.price,
        })),
        ...(payload.averageBroadbandSpeedInMegabytes && {
          averageBroadbandSpeedInMegabytes:
            +payload.averageBroadbandSpeedInMegabytes,
        }),
      }),
    };

    const result = await new ApiRequests().createProperty(castedPayload);
    if (result?.success) {
      resetForm();
      toast(result.message, {
        dismissible: true,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold">Create Property Listing</h1>
      <p className="text-gray-500 text-sm mb-6">
        Fill in the details below to list your property
      </p>

      {/* Step Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              step === i ? "bg-white shadow" : "text-gray-500 hover:text-black"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step Content */}
        {step === 0 && (
          <BasicStep
            addressesList={addressesList}
            onAddressSelection={handleOnAddressSelection}
            onAddressAutocomplete={handleOnAddressAutocomplete}
            form={form}
            update={update}
          />
        )}
        {step === 1 && propertyTypes && (
          <DetailsStep
            propertyTypes={propertyTypes}
            form={form}
            update={update}
          />
        )}
        {step === 2 && <AmenitiesStep form={form} update={update} />}
        {step === 3 && <MediaStep form={form} update={update} />}

        {/* Footer */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(0)}
            className="cursor-pointer px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="cursor-pointer px-4 py-2 border rounded-lg"
              >
                Previous
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="cursor-pointer px-4 py-2 bg-black text-white rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-black text-white rounded-lg"
              >
                Create Listing
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
