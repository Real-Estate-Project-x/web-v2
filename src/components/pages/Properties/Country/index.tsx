"use client";

import { FC, Fragment, useEffect, useState } from "react";
import Navbar from "../../Home/Nav";
import LoadingCard from "@/components/shared/loader-cards";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";
import { Footer } from "react-day-picker";
import { PropertyList } from "..";
import {
  AddressAutocompletion,
  PaginationControlInterface,
  PropertyInterface,
} from "../../../../../utils/interfaces";
import { axiosInstance } from "@/lib/axios-interceptor";
import { useSearchParams } from "next/navigation";
import { getCookie } from "@/lib/helpers";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  cleanObject,
  fetchAgencies,
  fetchPropertyTypes,
} from "../../../../../utils/helpers";
import {
  Bed,
  Building,
  Coins,
  PersonStandingIcon,
  SaveAll,
  Search,
  SlidersHorizontal,
  Toilet,
  Type,
  UsersRound,
} from "lucide-react";
import { PropertyUpFor } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertySearchPayload } from "../../Search-properties/search-form";
import { ApiRequests } from "@/lib/api.request";

interface FilterProps {
  loader: boolean;
  states: { id: string; name: string }[];
  propertyTypes: { id: string; name: string; tag: string }[];
  agencies: { id: string; name: string }[];
  addressesList: AddressAutocompletion[];
  setLoader: (v: boolean) => void;
  onSendData: (data: Partial<CountryViewSearchPayloadV2>) => void;
  onSaveData: (data: Partial<CountryViewSearchPayloadV2>) => void;
  onAddressAutocomplete: (address: string) => void;
}

interface CountryViewSearchPayloadV2 extends PropertySearchPayload {
  searchTerm: string;
  removeBoostedProperties: boolean;
}

export const CountryViewPropertyFilter: FC<FilterProps> = ({
  states,
  agencies,
  propertyTypes,
  addressesList,
  setLoader,
  onSendData,
  onSaveData,
  onAddressAutocomplete,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filter, setFilter] = useState<CountryViewSearchPayloadV2>({
    propertyTypeId: "",
    agencyId: "",
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
      agencyId: "",
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

  const addressUpdate = (address: string) => {
    setLocationQuery(address);
    setShowLocationDropdown(true);

    setTimeout(() => {
      onAddressAutocomplete(address);
    }, 5000);
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
          <div className="flex items-center gap-2 flex-row">
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

              {/* State */}
              <Select
                onValueChange={(value) =>
                  setFilter({ ...filter, stateId: value })
                }
              >
                <SelectTrigger className="full-height w-full">
                  <PersonStandingIcon />
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

export const PropertiesByCountry = () => {
  // add a new section to home page for properties of countries
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );
  const searchParams = useSearchParams();
  const countryCode = searchParams.get("name");
  const [countryName, setCountryName] = useState<string>("");
  const [copyData, setCopyData] = useState<PropertyInterface[]>([]);
  const [properties, setStateProperties] = useState<PropertyInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countryId, setCountryId] = useState<string>("");
  const [agencies, setAgencies] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [addressesList, setAddressesList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const savedPage = getCookie("page");
    return savedPage ? Number(savedPage) : 1;
  });

  const recordsPerPage: number = 10;
  const lastIndex: number = currentPage * recordsPerPage;
  const firstIndex: number = lastIndex - recordsPerPage;
  const records = properties?.slice(firstIndex, lastIndex);

  const fetchStates = async () => {
    const url = `/country/states/all/?countryId=${countryId}`;
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

  const fetchPropertiesByCountry = async (pageNumber = 1, pageSize = 10) => {
    const url = `/property/customer-listings/by-country/${countryCode}/?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    try {
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        const {
          data: { data, paginationControl },
        } = response;
        setCopyData(data);
        setStateProperties(data);
        setPagination(paginationControl);

        const [firstEl] = data;
        setCountryId(firstEl.state.countryId);
        setCountryName(firstEl.state.country.name);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching properties:", error);
      throw error;
    }
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

  const loadData = async (page: number) => {
    await fetchPropertiesByCountry(page);
  };

  const handleChildData = async (filter: any) => {
    // Query api
    await globalSearch(1, 10, { ...filter, countryId });
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
    if (!countryId) return;

    const url = `/property/customer-listings/by-country/search/${countryId}`;

    try {
      const response = await axiosInstance.post(url, {
        payload,
        pagination: { pageNumber, pageSize },
      });
      if (response.data?.success) {
        const {
          data: { data, paginationControl },
        } = response;
        setStateProperties(data);
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

  const handleSaveSearch = async (filter: any) => {
    // Query api
    setIsLoading(true);
    const response = await postSavedSearch({ ...filter, countryId });
    setIsLoading(false);

    if (response?.success) {
      toast.success(response.message ?? "Saved search successfully");
    }
  };

  useEffect(() => {
    Promise.all([
      loadData(1),
      fetchAgencies(setAgencies, toast),
      fetchPropertyTypes(setPropertyTypes),
    ]);

    if (countryId) {
      fetchStates();
    }
  }, [countryId]);

  return (
    <Fragment>
      <Navbar />
      <div className="p-4 sm:p-0 container mx-auto mt-24 mb-10">
        <h2 className="text-3xl font-normal text-navy-900 pb-5 pb-4 capitalize">
          <b>Properties In:: {countryName}</b>
        </h2>

        <CountryViewPropertyFilter
          loader={isLoading}
          states={states}
          agencies={agencies}
          propertyTypes={propertyTypes}
          addressesList={addressesList}
          setLoader={setIsLoading}
          onSendData={handleChildData}
          onSaveData={handleSaveSearch}
          onAddressAutocomplete={handleOnAddressAutocomplete}
        />

        {isLoading ? (
          <div className="flex justify-start">
            <LoadingCard />
          </div>
        ) : records?.length === 0 ? (
          <div className="text-center text-gray-500 pt-10">
            <p className="text-lg">
              No properties for <b>{countryName?.toUpperCase()}</b> available at
              the moment.
            </p>
          </div>
        ) : (
          <PropertyList array={records} />
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
    </Fragment>
  );
};
