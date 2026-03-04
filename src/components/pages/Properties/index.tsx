"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Navbar from "../Home/Nav";
import React, { FC, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Bath,
  Bed,
  Toilet,
  Building,
  Coins,
  MapPin,
  Search,
  SlidersHorizontal,
  Square,
  UsersRound,
  Type,
  SaveAll,
} from "lucide-react";
import Footer from "../Home/Footer";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PaginationControlInterface,
  PropertyInterface,
} from "../../../../utils/interfaces";
import PropertySearchForm, {
  PropertySearchPayload,
} from "../Search-properties/search-form";
import {
  cleanObject,
  defaultImageUrls,
  formatPrice,
} from "../../../../utils/helpers";
import LoadingCard from "@/components/shared/loader-cards";
import { axiosInstance } from "@/lib/axios-interceptor";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { PropertyUpFor } from "@/lib/constants";

type Props = {
  array: PropertyInterface[];
};

interface FilterProps {
  loader: boolean;
  // preSelectedCategory?: PropertyUpFor;
  propertyTypes: { id: string; name: string; tag: string }[];
  states: { id: string; name: string }[];
  agencies: { id: string; name: string }[];
  setLoader: (v: boolean) => void;
  onSendData: (data: Partial<PropertySearchPayloadV2>) => void;
  onSaveData: (data: Partial<PropertySearchPayloadV2>) => void;
}

interface PropertySearchPayloadV2 extends PropertySearchPayload {
  searchTerm: string;
}

export const PropertyFilter: FC<FilterProps> = ({
  agencies,
  propertyTypes,
  states,
  setLoader,
  onSendData,
  onSaveData,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [filter, setFilter] = useState<PropertySearchPayloadV2>({
    propertyTypeId: "",
    stateId: "",
    agencyId: "",
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
    squareFootage: {
      start: undefined as number | undefined,
      end: undefined as number | undefined,
    },
  });

  const resetFilters = () => {
    setFilter({
      propertyTypeId: "",
      stateId: "",
      agencyId: "",
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
      squareFootage: {
        start: undefined as number | undefined,
        end: undefined as number | undefined,
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
                  <Type />
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {states?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Agency */}
              <Select
                onValueChange={(value) =>
                  setFilter({ ...filter, agencyId: value })
                }
              >
                <SelectTrigger className="full-height w-full">
                  <UsersRound />
                  <SelectValue placeholder="Select Agency" />
                </SelectTrigger>
                <SelectContent>
                  {agencies?.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      {agency.name}
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

export const PropertyList: FC<Props> = ({ array }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
      {array?.map((property) => (
        <div key={property?.id}>
          <Card
            key={property?.id}
            className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white cursor-pointer group"
            onClick={() => router.push(`/properties/view?id=${property?.slug}`)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={property?.propertyImages?.[0]?.image?.url}
                alt={property?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge
                className={`${
                  property?.upFor === "RENT" ? "bg-[#0253CC]" : "bg-green-800"
                } absolute top-4 left-4 hover:bg-real-700 capitalize px-4 py-1.5 rounded-full`}
              >
                {property?.upFor?.toLowerCase()}
              </Badge>
              {property?.isNewBuilding && (
                <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
                  New
                </Badge>
              )}
              <Badge className="absolute bottom-4 right-4 bg-white text-foreground shadow-lg py-1.5 rounded-xl">
                {formatPrice(property?.price)}
              </Badge>
            </div>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors capitalize">
                {property?.title}
              </h3>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm capitalize">{property?.address}</span>
              </div>
              <div className="flex justify-between text-muted-foreground border-t pt-4">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span className="text-sm">{property?.noOfBedrooms} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span className="text-sm">
                    {property?.noOfToilets} Toilets
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  <span className="text-sm">
                    {property?.sizeInSquareFeet} sqft
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

const Properties = () => {
  const [properties, setProperties] = useState<PropertyInterface[]>([]);
  const [copyData, setCopyData] = useState<PropertyInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [type, setType] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);

  const handleChildData = async (filter: any) => {
    // Query api
    await globalSearch(1, 10, filter);
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
    const url = `/property/customer-listings/global-search/?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    try {
      const response = await axiosInstance.post(url, payload);
      if (response.data?.success) {
        const {
          data: { data, paginationControl },
        } = response;
        setProperties((data as any[]).map(({ property }) => property));
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
    const response = await postSavedSearch(filter);
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

  const fetchAgencies = async () => {
    const url = `/agency/dropdown/agency-list/?fields=success,paginationControl,data(id,name,description)`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setAgencies(response.data.data);
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
    Promise.all([
      loadData(1),
      fetchStates(),
      fetchAgencies(),
      fetchPropertyTypes(),
    ]);
  }, []);

  const loadData = async (page: number) => {
    await fetchProperties(page);
  };

  async function fetchProperties(pageNumber = 1, pageSize = 10) {
    const url = `/property/customer-listings/featured-properties/?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        const {
          data: { data, paginationControl },
        } = response;

        // [Remove_later] Line is a patch for faulty image_urls from image_kit
        (data as any[]).map((item) => defaultImageUrls(item));

        setCopyData(data);
        setProperties(data);

        setPagination(paginationControl);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching properties:", error);
    }
  }

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-6 sm:mx-10 md:mx-16 mt-24 mb-10">
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#102A43] mb-2">
            Find Your Dream Home
          </h1>
          <p className="text-[#486581] max-w-xl font-normal">
            Explore sought-after locations trusted by buyers and renters alike.
          </p>
        </div>

        <PropertyFilter
          states={states}
          loader={isLoading}
          agencies={agencies}
          propertyTypes={propertyTypes}
          setLoader={setIsLoading}
          onSendData={handleChildData}
          onSaveData={handleSaveSearch}
        />

        {isLoading ? (
          <div className="flex justify-start">
            <LoadingCard />
          </div>
        ) : properties.length <= 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg pt-6">
              {(type && type.toLowerCase() === "RENT") ||
              type.toLowerCase() === "SALE"
                ? `No properties for ${type} available at the moment`
                : "No properties available at the moment"}
              .
            </p>
          </div>
        ) : (
          <PropertyList array={properties} />
        )}

        {pagination?.currentPage && (
          <DynamicPagination
            currentPage={pagination?.currentPage}
            totalPages={pagination?.totalPages}
            hasNext={pagination?.hasNext}
            hasPrevious={pagination?.hasPrevious}
            onPageChange={loadData}
          />
        )}
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default Properties;
