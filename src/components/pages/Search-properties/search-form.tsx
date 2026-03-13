"use client";

import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyUpFor } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { AddressAutocompletion } from "../../../../utils/interfaces";

export interface PropertySearchPayload {
  propertyTypeId: string;
  stateId: string;
  agencyId: string;
  upFor?: PropertyUpFor;

  pricing: {
    start?: number;
    end?: number;
  };

  numberOfBeds?: number;
  numberOfToilets?: number;

  isNewBuilding: boolean;
  isPetFriendly: boolean;
  hasWifi: boolean;
  hasLaundry: boolean;
  hasCarParking: boolean;
  hasKidsPlayArea: boolean;
  hasCctv: boolean;
  hasGym: boolean;
  hasArchitecturalPlans: boolean;

  squareFootage: {
    start?: number;
    end?: number;
  };

  location: {
    searchRadiusInKm?: number;
    startLocation: {
      latitude?: number;
      longitude?: number;
    };
  };
}

interface Props {
  loader: boolean;
  preSelectedCategory?: PropertyUpFor;
  propertyTypes: { id: string; name: string; tag: string }[];
  states: { id: string; name: string }[];
  agencies: { id: string; name: string }[];
  addressesList: AddressAutocompletion[];
  setLoader: (v: boolean) => void;
  onSendData: (data: any) => void;
  onAddressAutocomplete: (address: string) => void;
}

const PropertySearchForm: FC<Props> = ({
  loader,
  setLoader,
  propertyTypes,
  onSendData,
  states,
  agencies,
  addressesList,
  preSelectedCategory,
  onAddressAutocomplete,
}) => {
  const [locationQuery, setLocationQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filter, setFilter] = useState<PropertySearchPayload>({
    propertyTypeId: "",
    stateId: "",
    agencyId: "",
    upFor: preSelectedCategory ?? undefined,
    pricing: {
      start: undefined as number | undefined,
      end: undefined as number | undefined,
    },
    numberOfBeds: undefined as number | undefined,
    numberOfToilets: undefined as number | undefined,
    isNewBuilding: false,
    isPetFriendly: false,
    hasWifi: false,
    hasLaundry: false,
    hasCarParking: false,
    hasKidsPlayArea: false,
    hasCctv: false,
    hasGym: false,
    hasArchitecturalPlans: false,
    squareFootage: {
      start: undefined as number | undefined,
      end: undefined as number | undefined,
    },
    location: {
      searchRadiusInKm: undefined as number | undefined,
      startLocation: {
        latitude: undefined as number | undefined,
        longitude: undefined as number | undefined,
      },
    },
  });

  const getPropertyType = (propertyTypeId: string) => {
    if (!propertyTypes.length) return;

    return propertyTypes.find(({ id }) => id === propertyTypeId);
  };

  const updateAmenity = (key: keyof typeof filter, value: boolean) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    console.log({ filter });
    onSendData(filter);
  };

  const resetFilters = () => {
    setFilter({
      propertyTypeId: "",
      stateId: "",
      agencyId: "",
      upFor: preSelectedCategory ?? undefined,
      pricing: {
        start: undefined as number | undefined,
        end: undefined as number | undefined,
      },
      numberOfBeds: undefined as number | undefined,
      numberOfToilets: undefined as number | undefined,
      isNewBuilding: false,
      isPetFriendly: false,
      hasWifi: false,
      hasLaundry: false,
      hasCarParking: false,
      hasKidsPlayArea: false,
      hasCctv: false,
      hasGym: false,
      hasArchitecturalPlans: false,
      squareFootage: {
        start: undefined as number | undefined,
        end: undefined as number | undefined,
      },
      location: {
        searchRadiusInKm: undefined as number | undefined,
        startLocation: {
          latitude: undefined as number | undefined,
          longitude: undefined as number | undefined,
        },
      },
    });
    setLoader(false);
  };

  const addressUpdate = (address: string) => {
    setLocationQuery(address);
    setShowLocationDropdown(true);

    setTimeout(() => {
      onAddressAutocomplete(address);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Advanced Property Search</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ---- All Your Fields Remain Same ---- */}

        {/* Amenities Example */}
        <div className="grid grid-cols-2 gap-3 pb-3">
          {[
            { label: "Car Parking", key: "hasCarParking" },
            { label: "Gym", key: "hasGym" },
            { label: "Kids Play Area", key: "hasKidsPlayArea" },
            { label: "New Building", key: "isNewBuilding" },
            { label: "CCTV", key: "hasCctv" },
            { label: "Pet Friendly", key: "isPetFriendly" },
            { label: "Wifi", key: "hasWifi" },
            { label: "Laundry", key: "hasLaundry" },
            { label: "Has Architectural Plans", key: "hasArchitecturalPlans" },
          ].map((item) => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox
                checked={filter[item.key as keyof typeof filter] as boolean}
                onCheckedChange={(checked) =>
                  updateAmenity(
                    item.key as keyof typeof filter,
                    checked as boolean
                  )
                }
              />
              <Label>{item.label}</Label>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pt-8 border-top">
          {/* Agency (Select) */}
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select
              value={filter.propertyTypeId}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, propertyTypeId: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes?.map((type) => (
                  <SelectItem
                    className="capitalize"
                    key={type.id}
                    value={type.id}
                  >
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {getPropertyType(filter.propertyTypeId)?.tag === "RESIDENTIAL" && (
            <>
              {/* Bedrooms (Input) */}
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  min={1}
                  value={filter.numberOfBeds ?? ""}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      numberOfBeds: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>

              {/* Toilets (Input) */}
              <div className="space-y-2">
                <Label>Toilets</Label>
                <Input
                  type="number"
                  min={1}
                  value={filter.numberOfToilets ?? ""}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      numberOfToilets: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>
            </>
          )}

          {/* Up For (Select) */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filter.upFor}
              onValueChange={(value) =>
                setFilter((prev) => ({
                  ...prev,
                  upFor: value as PropertyUpFor,
                }))
              }
            >
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PropertyUpFor).map((category) => (
                  <SelectItem
                    className="capitalize"
                    key={category}
                    value={category}
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State (Select) */}
          <div className="space-y-2">
            <Label>State</Label>
            <Select
              value={filter.stateId}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, stateId: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states?.map((state) => (
                  <SelectItem
                    key={state.id}
                    className="capitalize"
                    value={state.id}
                  >
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Agency (Select) */}
          <div className="space-y-2">
            <Label>Agency</Label>
            <Select
              value={filter.agencyId}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, agencyId: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select agency" />
              </SelectTrigger>
              <SelectContent>
                {agencies?.map((agency) => (
                  <SelectItem
                    className="capitalize"
                    key={agency.id}
                    value={agency.id}
                  >
                    {agency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <>
          <h2 className="mb-3">
            <b>Price*</b>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-10 border-bottom">
            <div>
              <Label className="pb-2">Min Price</Label>
              <Input
                type="number"
                min={1}
                value={filter.pricing.start ?? ""}
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      start: +e.target.value,
                    },
                  }));
                }}
              />
            </div>

            <div>
              <Label className="pb-2">Max Price</Label>
              <Input
                type="number"
                min={1}
                value={filter.pricing.end ?? ""}
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      end: +e.target.value,
                    },
                  }));
                }}
              />
            </div>
          </div>
        </>

        <>
          <h2 className="mb-3">
            <b>Square Footage*</b>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-10">
            <div>
              <Label className="pb-2">Min Footage</Label>
              <Input
                type="number"
                min={1}
                value={filter.squareFootage.start ?? ""}
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    squareFootage: {
                      ...prev.squareFootage,
                      start: +e.target.value,
                    },
                  }));
                }}
              />
            </div>

            <div>
              <Label className="pb-2">Max Footage</Label>
              <Input
                type="number"
                min={1}
                value={filter.squareFootage.end ?? ""}
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    squareFootage: {
                      ...prev.squareFootage,
                      end: +e.target.value,
                    },
                  }));
                }}
              />
            </div>
          </div>
        </>

        <>
          <h2 className="mb-3">
            <b>Geo Point Search*</b>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-bottom">
            {/* Address Search */}
            <div className="relative md:col-span-3">
              <Input
                type="text"
                placeholder="Search starting geo_point..."
                value={locationQuery}
                onChange={(e) => addressUpdate(e.target.value)}
                className="h-12"
              />

              {showLocationDropdown && addressesList?.length > 0 && (
                <div className="absolute z-50 bg-white border w-full rounded-lg shadow mt-1 max-h-60 overflow-y-auto">
                  {addressesList.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setShowLocationDropdown(false);
                        setLocationQuery(item.formattedAddress);
                        setFilter({
                          ...filter,
                          location: {
                            ...filter.location,
                            startLocation: {
                              latitude: +item.geolocation.latitude,
                              longitude: +item.geolocation.longitude,
                            },
                          },
                        });
                      }}
                    >
                      {item.formattedAddress}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search Radius */}
            <div className="relative md:col-span-1">
              <Input
                type="number"
                placeholder="Search Radius (km)"
                className="h-12"
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    location: {
                      ...filter.location,
                      searchRadiusInKm: +e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          {/* Apply Filters */}
          <Button type="submit" disabled={loader}>
            {loader ? "Applying..." : "Apply Filters"}
          </Button>

          {/* Reset */}
          <Button type="button" variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertySearchForm;
