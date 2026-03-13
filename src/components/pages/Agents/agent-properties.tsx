"use client";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { PropertyUpFor } from "@/lib/constants";
import React, { FC, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Bed,
  Bath,
  Square,
  ArrowLeft,
  Building,
  Search,
  SlidersHorizontal,
  Calendar,
  Coins,
  Type,
  UsersRound,
  Toilet,
  SaveAll,
} from "lucide-react";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";
import { axiosInstance } from "@/lib/axios-interceptor";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AddressAutocompletion,
  AgencyInterface,
  PaginationControlInterface,
  PropertyInterface,
} from "../../../../utils/interfaces";
import { cleanObject, formatPrice } from "../../../../utils/helpers";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";
import { PropertySearchPayload } from "../Search-properties/search-form";

interface FilterProps {
  loader: boolean;
  propertyTypes: { id: string; name: string; tag: string }[];
  states: { id: string; name: string }[];
  addressesList: AddressAutocompletion[];
  setLoader: (v: boolean) => void;
  onSendData: (data: Partial<AgencyPropertyViewSearchPayloadV2>) => void;
  onSaveData: (data: Partial<AgencyPropertyViewSearchPayloadV2>) => void;
  onAddressAutocomplete: (address: string) => void;
}

interface AgencyPropertyViewSearchPayloadV2
  extends Omit<PropertySearchPayload, "agencyId"> {
  searchTerm: string;
  removeBoostedProperties: boolean;
}

export const AgencyPropertyViewPropertyFilter: FC<FilterProps> = ({
  states,
  addressesList,
  propertyTypes,
  setLoader,
  onSendData,
  onSaveData,
  onAddressAutocomplete,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filter, setFilter] = useState<AgencyPropertyViewSearchPayloadV2>({
    propertyTypeId: "",
    stateId: "",
    searchTerm: "",
    upFor: undefined,
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
    removeBoostedProperties: false,
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

  const resetFilters = () => {
    setFilter({
      propertyTypeId: "",
      stateId: "",
      searchTerm: "",
      upFor: undefined,
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
      removeBoostedProperties: false,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    onSendData(cleanObject(filter));
  };

  const applyFilters = () => {
    setLoader(true);
    onSendData(cleanObject(filter));
  };

  const getPropertyType = (propertyTypeId: string) => {
    if (!propertyTypes.length) return;

    return propertyTypes.find(({ id }) => id === propertyTypeId);
  };

  const saveSearch = () => {
    const { pricing, squareFootage, ...rest } = filter;

    const payload = {
      ...rest,
      ...(squareFootage && {
        roomSpaceSizeEndRange: squareFootage.end,
        roomSpaceSizeStartRange: squareFootage.start,
      }),
      ...(pricing && {
        endPriceRange: pricing.end,
        startPriceRange: pricing.start,
      }),
    };

    setLoader(true);
    onSaveData(cleanObject(payload));
  };

  const addressUpdate = (address: string) => {
    setLocationQuery(address);
    setShowLocationDropdown(true);

    setTimeout(() => {
      onAddressAutocomplete(address);
    }, 5000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full flex flex-col gap-4">
        {/* Top Search Row */}
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Search Input */}
          <div className="w-full lg:w-3/3 relative">
            <Input
              type="text"
              placeholder="Search by location, property type..."
              className="pl-10 h-12"
              onChange={(e) =>
                setFilter({ ...filter, searchTerm: e.target.value })
              }
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Toggle Advanced */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {" "}
            <SlidersHorizontal />
            {showAdvanced ? "Hide Advanced" : "Show Advanced"}
          </Button>

          <Button className="cursor-pointer" type="submit">
            <Search /> Search
          </Button>

          <Button
            type="button"
            className="cursor-pointer"
            variant="secondary"
            onClick={saveSearch}
          >
            <SaveAll /> Save Search
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <section className="border rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-4 gap-4 p-4 border-bottom">
              {/* Price */}
              <Select
                onValueChange={(value: string) => {
                  const [min, max] = value.split("-");
                  setFilter({
                    ...filter,
                    pricing: { start: +min, end: +max },
                  });
                }}
              >
                <SelectTrigger className="full-height w-full">
                  <Coins />
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200000-500000">₦200k - ₦500k</SelectItem>
                  <SelectItem value="500000-1000000">₦500k - ₦1M</SelectItem>
                  <SelectItem value="1000000-2000000">₦1M - ₦2M</SelectItem>
                  <SelectItem value="2000000-5000000">₦2M - ₦5M</SelectItem>
                  <SelectItem value="5000000-">₦5M+</SelectItem>
                </SelectContent>
              </Select>

              {/* Square_footage */}
              <Select
                onValueChange={(value: string) => {
                  const [min, max] = value.split("-");
                  setFilter({
                    ...filter,
                    squareFootage: { start: +min, end: +max },
                  });
                }}
              >
                <SelectTrigger className="full-height w-full">
                  <Coins />
                  <SelectValue placeholder="Square Footage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200-500">200sqFT - 500sqFT</SelectItem>
                  <SelectItem value="500-800">500sqFT - 800sqFT</SelectItem>
                  <SelectItem value="800-1000">800sqFT - 1,000sqFT</SelectItem>
                  <SelectItem value="1000-2000">
                    1,000sqFT - 2,000sqFT
                  </SelectItem>
                  <SelectItem value="2000-20000">2,000sqT+</SelectItem>
                </SelectContent>
              </Select>

              {/* Up For */}
              <Select
                onValueChange={(value) =>
                  setFilter({ ...filter, upFor: value as PropertyUpFor })
                }
              >
                <SelectTrigger className="full-height w-full">
                  <Building />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PropertyUpFor).map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Property Type */}
              <Select
                onValueChange={(value) =>
                  setFilter({ ...filter, propertyTypeId: value })
                }
              >
                <SelectTrigger className="full-height w-full">
                  <Type />
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {getPropertyType(filter.propertyTypeId)?.tag ===
                "RESIDENTIAL" && (
                <>
                  {/* Bedrooms */}
                  <Select
                    onValueChange={(value) =>
                      setFilter({ ...filter, numberOfBeds: +value })
                    }
                  >
                    <SelectTrigger className="full-height w-full">
                      <Bed />
                      <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8+</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Toilets */}
                  <Select
                    onValueChange={(value) =>
                      setFilter({ ...filter, numberOfToilets: +value })
                    }
                  >
                    <SelectTrigger className="full-height w-full">
                      <Toilet />
                      <SelectValue placeholder="Toilets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}

              {/* State */}
              <Select
                onValueChange={(value) =>
                  setFilter({ ...filter, stateId: value })
                }
              >
                <SelectTrigger className="full-height w-full">
                  <UsersRound />
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states?.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border-bottom">
              {/* Boolean Checkboxes */}
              {[
                "hasArchitecturalPlans",
                "hasCarParking",
                "isNewBuilding",
                "isPetFriendly",
                "hasWifi",
                "hasLaundry",
                "hasKidsPlayArea",
                "hasCctv",
                "hasGym",
                "removeBoostedProperties",
              ].map((field) => (
                <div key={field} className="flex items-center gap-2">
                  <Checkbox
                    onCheckedChange={(checked) =>
                      setFilter({ ...filter, [field]: checked })
                    }
                  />
                  <label className="text-sm capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                </div>
              ))}
            </div>

            {/* Location Filter */}
            <h3 className="pl-5 pt-4">
              <b>Geo Point Search*</b>
            </h3>
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
            </div>

            <div className="w-full flex justify-end gap-4 p-4">
              <Button className="cursor-pointer" onClick={applyFilters}>
                Apply Filter
              </Button>

              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </section>
        )}
      </div>
    </form>
  );
};

const AgentProperties = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();
  const [agency, setAgency] = useState<AgencyInterface>({} as AgencyInterface);

  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [properties, setProperties] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [addressesList, setAddressesList] = useState<any[]>([]);

  const allProperties = agency && agency?.properties ? agency?.properties : []; //agent ? generatePropertiesForAgent(agent.id) : [];

  const loadData = async (page: number) => {
    await fetchProperties(page);
  };

  const fetchStates = async () => {
    const url = "/country/states/by-country";
    try {
      const response = await axiosInstance.get(url);
      if (response.data?.success) {
        const result = response.data;
        setStates(result.data);

        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchPropertyTypes = async () => {
    const url = "/property-type";
    try {
      const response = await axiosInstance.get(url);
      if (response.data?.success) {
        const result = response.data;
        setPropertyTypes(result.data);

        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchProperties = async (pageNumber = 1, pageSize = 10) => {
    const url = `/property/customer-listings/by-agency/${id}/?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        const {
          data: { data, paginationControl },
        } = response;
        setProperties(data);
        setPagination(paginationControl);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  };

  // Filter properties based on search and filters
  const filteredProperties = allProperties.filter(
    (property: PropertyInterface) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        propertyType === "all" || property?.propertyType?.name === propertyType;

      const priceNum = property?.price;
      let matchesPrice = true;
      if (priceRange === "under500k") matchesPrice = priceNum < 500000;
      else if (priceRange === "500k-1m")
        matchesPrice = priceNum >= 500000 && priceNum < 1000000;
      else if (priceRange === "1m-2m")
        matchesPrice = priceNum >= 1000000 && priceNum < 2000000;
      else if (priceRange === "over2m") matchesPrice = priceNum >= 2000000;

      let matchesBedrooms = true;
      if (bedroomFilter === "1-2")
        matchesBedrooms =
          property?.noOfBedrooms >= 1 && property.noOfBedrooms <= 2;
      else if (bedroomFilter === "3-4")
        matchesBedrooms =
          property.noOfBedrooms >= 3 && property.noOfBedrooms <= 4;
      else if (bedroomFilter === "5+")
        matchesBedrooms = property.noOfBedrooms >= 5;

      return matchesSearch && matchesType && matchesPrice && matchesBedrooms;
    }
  );

  const handleChildData = async (filter: any) => {
    // Query api
    await globalSearch(1, 10, { ...filter, agencyId: id });
  };

  const globalSearch = async (pageNumber = 1, pageSize = 10, payload = {}) => {
    setIsLoading(true);
    await fetchSearchResults(pageNumber, pageSize, payload);
    setIsLoading(false);
  };

  const fetchSearchResults = async (
    pageNumber = 1,
    pageSize = 10,
    payload = {}
  ) => {
    if (!id) return;

    const url = `/property/customer-listings/by-agency/search/${id}`;

    try {
      const response = await axiosInstance.post(url, {
        payload,
        pagination: { pageNumber, pageSize },
      });
      if (response.data?.success) {
        const {
          data: { data, paginationControl },
        } = response;
        setProperties(data);
        setPagination(paginationControl);
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

  const handleSaveSearch = async (filter: any) => {
    // Query api
    setIsLoading(true);
    const response = await postSavedSearch({ ...filter, agencyId: id });
    setIsLoading(false);

    if (response?.success) {
      toast.success(response.message ?? "Saved search successfully");
    }
  };

  const postSavedSearch = async <T,>(payload: T): Promise<any> => {
    try {
      const url = "/saved-search/?fields=success,code,message";

      const response = await axiosInstance.post(url, payload);
      if (!response.data) return;

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const fetchAgencyRecord = async (agencyId: string) => {
    const url = `/agency/${agencyId}`;
    const response = await axiosInstance.get(url);
    if (response.data?.success) {
      setAgency(response.data.data);
    }
  };

  const handleOnAddressAutocomplete = async (address: string) => {
    if (!address) return;

    const url = `/map/address-autocomplete/${address}`;
    try {
      const result = await axiosInstance.get(url);
      if (result.data?.success) {
        setAddressesList(result.data.data);
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

  useEffect(() => {
    const requests = [loadData(1), fetchPropertyTypes(), fetchStates()];
    if (id) {
      requests.push(fetchAgencyRecord(id));
    }
    Promise.all(requests);
  }, []);

  if (!agency) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Agent Not Found
            </h1>
            <Button onClick={() => router.push("/agents")}>
              Back to Agents
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />

      <main className="flex-1">
        {/* Agent Header Section */}
        <section className="mt-8 relative py-12 bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10 mb-6"
              onClick={() => router.push("/agents")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white/20 shadow-2xl">
                  <AvatarImage
                    src={agency?.createdByUser?.profileImage}
                    alt={`${agency?.createdByUser?.firstName} ${agency?.createdByUser?.lastName}`}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-blue-600 text-white">
                    {agency?.createdByUser?.firstName}
                    {agency?.createdByUser?.lastName}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-3 border-white shadow-lg ${
                    agency?.isRegistered ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
                    {agency?.name}
                  </h1>
                  <Badge
                    className={`${
                      agency?.isRegistered
                        ? "bg-green-600 text-white"
                        : "bg-gray-500 text-white"
                    } text-sm py-2 rounded-full`}
                  >
                    {agency?.isRegistered ? "Registered" : "Not-Registered"}
                  </Badge>
                </div>
                <p className="text-lg text-white/80 capitalize">
                  {agency?.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 my-2">
                  <div className="flex items-center gap-2 text-white">
                    <Phone className="h-4 w-4" />
                    <span>{agency?.agencyPhoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Mail className="h-4 w-4" />
                    <span>{agency?.email}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{agency?.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 capitalize">
                    <MapPin className="h-4 w-4" />
                    <span>{agency?.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined Since{" "}
                      {new Date(
                        agency?.dateOfIncorporation
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Properties Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground capitalize">
                  Properties by:: {agency?.name}
                </h2>
              </div>
              <Badge variant="secondary" className="text-sm">
                {filteredProperties.length} of {allProperties.length} Properties
              </Badge>
            </div>

            {/* Search and Filter Section */}
            <AgencyPropertyViewPropertyFilter
              loader={isLoading}
              states={states}
              propertyTypes={propertyTypes}
              addressesList={addressesList}
              setLoader={setIsLoading}
              onSendData={handleChildData}
              onSaveData={handleSaveSearch}
              onAddressAutocomplete={handleOnAddressAutocomplete}
            />

            {properties.length <= 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
                  <Building className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-muted-foreground mb-2">
                    {allProperties.length === 0
                      ? "No properties"
                      : "No matching properties"}
                  </h3>
                  <p className="text-muted-foreground">
                    {allProperties.length === 0
                      ? "This agent has no active listings."
                      : "Try adjusting your search or filters."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property: any) => (
                    <Card
                      key={property.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white cursor-pointer group"
                      onClick={() =>
                        router.push(`/properties/view?id=${property.slug}`)
                      }
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={
                            property.propertyImages &&
                            property.propertyImages.length > 0
                              ? property.propertyImages?.[0]?.image?.url
                              : "https://via.placeholder.com/400x300?text=No+Image"
                          }
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-4 left-4 bg-primary">
                          {property?.propertyType?.name}
                        </Badge>
                        <Badge className="absolute top-4 right-4 bg-white text-foreground shadow-lg">
                          {formatPrice(property.price)}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property?.address}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground border-t pt-4">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span className="text-sm">
                              {property?.noOfBedrooms} beds
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span className="text-sm">
                              {property?.noOfToilets} baths
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            <span className="text-sm">
                              {property.sizeInSquareFeet} sqft
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {pagination?.currentPage && (
            <DynamicPagination
              currentPage={pagination?.currentPage}
              totalPages={pagination?.totalPages}
              hasNext={pagination?.hasNext}
              hasPrevious={pagination?.hasPrevious}
              onPageChange={loadData}
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AgentProperties;
