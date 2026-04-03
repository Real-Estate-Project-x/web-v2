"use client";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { ApiRequests } from "@/lib/api.request";
import { PropertyUpFor } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { BasicStep } from "./components/basic-step";
import { MediaStep } from "./components/media-step";
import { DetailsStep } from "./components/details-step";
import { AmenitiesStep } from "./components/amenties-step";
import { cleanObject } from "../../../../../utils/helpers";

const steps = ["Basic", "Details", "Amenities", "Media"];

export const EditProperty = ({}) => {
  type StepTarget = number | ((prev: number) => number);
  const stepBackActions: Record<number, () => void> = {
    1: () => fetchPropertyTypes(form.upFor),
  };
  const [step, setStep] = useState(0);
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState<string>("");
  const [property, setProperty] = useState<any>(null);
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
    ownershipDocIds: [],
  });

  const loadData = async (slug: string) => {
    const result = await new ApiRequests().findPropertyById(slug);

    if (!result) return;

    setProperty(result.data);
    presetFormData(result.data);
  };

  const fetchPropertyTypes = async (listingType: PropertyUpFor) => {
    const result = await new ApiRequests().fetchPropertyTypes({
      listingType,
      fields: "success,data(id,name,status,tag,isUnit,listingType)",
    });
    if (!result) return;

    setPropertyTypes(result.data);
  };

  const presetFormData = (property: any) => {
    setForm((prev) => ({
      ...prev,
      price: property.price,
      title: property.title,
      upFor: property.upFor,
      stateId: property.stateId,
      noOfToilets: property.noOfToilets,
      noOfKitchens: property.noOfKitchens,
      noOfBedrooms: property.noOfBedrooms,
      address: property.address,
      agencyId: property.agencyId,
      description: property.description,
      propertyTypeId: property.propertyTypeId,
      additionalCosts: property.additionalCosts,
      hasCctv: property.hasCctv,
      isNewBuilding: property.isNewBuilding,
      hasKidsPlayArea: property.hasKidsPlayArea,
      hasGym: property.hasGym,
      averageBroadbandSpeedInMegabytes:
        property.averageBroadbandSpeedInMegabytes,
      hasLaundry: property.hasLaundry,
      hasWifi: property.hasWifi,
      hasCarParking: property.hasCarParking,
      sizeInSquareFeet: property.sizeInSquareFeet,
      ...(property.geoCoordinates && {
        geoCoordinates: {
          latitude: +property.geoCoordinates.coordinates[0],
          longitude: +property.geoCoordinates.coordinates[1],
        },
      }),
    }));
  };

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

    if (!property?.id) return;

    // Clean_data and remove null/undefined values
    const payload = cleanObject({
      ...form,
      propertyId: property.id,
    });

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
    const result = await new ApiRequests().updateProperty(castedPayload);
    if (result?.success) {
      setStep(0);
      toast(result.message, {
        dismissible: true,
      });
    }
  };

  const handleStepChange = useCallback(
    (target?: StepTarget) => {
      const newStep = Math.max(
        typeof target === "function" ? target(step) : target ?? step - 1,
        0
      );
      stepBackActions[newStep]?.();
      setStep(newStep);
    },
    [step, form.upFor]
  );

  useEffect(() => {
    const slug = searchParams.get("id");

    if (!slug) return;

    setSlug(slug);
    loadData(slug);
  }, [slug]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold">Update Property Listing</h1>
      <p className="text-gray-500 text-sm mb-6">
        Fill in the details below to list your property
      </p>

      {/* Step Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => handleStepChange(i)}
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

        {/* Detail Content */}
        {step === 1 && propertyTypes && (
          <DetailsStep
            propertyTypes={propertyTypes}
            form={form}
            update={update}
          />
        )}

        {/* Amenities */}
        {step === 2 && <AmenitiesStep form={form} update={update} />}

        {/* Media */}
        {step === 3 && <MediaStep type={"edit"} form={form} update={update} />}

        {/* Footer */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => handleStepChange(0)}
            className="cursor-pointer px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          {/*.  */}
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => handleStepChange((prev) => prev - 1)}
                className="cursor-pointer px-4 py-2 border rounded-lg"
              >
                Previous
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => handleStepChange((prev) => prev + 1)}
                className="cursor-pointer px-4 py-2 bg-black text-white rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-black text-white rounded-lg"
              >
                Update Listing
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
