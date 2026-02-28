"use client";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Search, SlidersHorizontal } from "lucide-react";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";
import PropertySearchForm, { PropertySearchPayload } from "./search-form";
import SearchResultsList from "./results";
import { axiosInstance } from "@/lib/axios-interceptor";
import {
  PaginationControlInterface,
  SearchPropertyInterfaceType,
} from "../../../../utils/interfaces";
import { PropertyUpFor } from "@/lib/constants";
import { cleanObject } from "../../../../utils/helpers";
import { SearchResultsLoaderCard } from "@/components/shared/loader-cards";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";

const SearchResults = () => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);

  const filter = searchParams.get("filter") as string;
  const query = searchParams.get("query") as string;
  const [togglePrice, setTogglePrice] = useState<boolean>(false);
  const [toggleDate, setToggleDate] = useState<boolean>(false);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [upFor, setUpFor] = useState<PropertyUpFor>();
  const [searchTerm, setSearchTerm] = useState<string>();
  const [searchResults, setSearchResults] = useState<
    SearchPropertyInterfaceType[]
  >([] as SearchPropertyInterfaceType[]);
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );
  const [advancedSearchParams, setAdvancedSearchParams] = useState<
    PropertySearchPayload | undefined
  >();

  //how to sort by price
  const sortByPrice = () => {
    const sortedData = [...searchResults].sort((a, b) => {
      if (togglePrice) {
        return (b?.property?.price || 0) - (a?.property?.price || 0);
      }
      return (a?.property?.price || 0) - (b?.property?.price || 0);
    });
    setTogglePrice(!togglePrice);
    setSearchResults(sortedData);
  };

  //sorting by date in ascending and descending order
  const sortByDate = () => {
    const sortedData = [...searchResults].sort((a, b) => {
      if (toggleDate) {
        return (
          new Date(b?.property?.dateCreated || "").getTime() -
          new Date(a?.property?.dateCreated || "").getTime()
        );
      }
      return (
        new Date(a?.property?.dateCreated || "").getTime() -
        new Date(b?.property?.dateCreated || "").getTime()
      );
    });
    setToggleDate(!toggleDate);
    setSearchResults(sortedData);
  };

  const handleChildData = async (data: any) => {
    const payload = cleanObject(data) as PropertySearchPayload;
    setAdvancedSearchParams(payload);

    // Query api
    await globalSearch(1, 10);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Query api
    await globalSearch(1, 10);
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

  async function fetchAgencies() {
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
  }

  const loadData = async (pageNumber = 1) => {
    await globalSearch(pageNumber);
  };

  const globalSearch = async (pageNumber = 1, pageSize = 10) => {
    let mergedPayload: Partial<PropertySearchPayload> = {};
    if (advancedSearchParams) {
      mergedPayload = Object.fromEntries(
        Object.entries(advancedSearchParams).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      ) as Partial<PropertySearchPayload>;
    }
    console.log({ advancedSearchParams });

    const payload = {
      ...(searchTerm && { searchTerm }),
      ...mergedPayload,
    };

    setLoading(true);
    await fetchSearchResults(pageNumber, pageSize, payload);
    setLoading(false);
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
        setSearchResults(data);
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

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      const { searchText, category } = JSON.parse(String(query));
      setUpFor(category);
      setSearchTerm(searchText);
      globalSearch();
    }

    Promise.all([fetchStates(), fetchAgencies(), fetchPropertyTypes()]);
  }, [searchParams, searchTerm, upFor]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="relative h-[200px] bg-gradient-to-r from-navy-900 to-navy-800 mt-16">
        {/*  */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative">
          <h1 className="text-3xl md:text-4xl font-medium text-white mb-4 text-center">
            Search Properties
          </h1>
          {/* <Badge variant="secondary" className="text-base ">
                Find Your Perfect Home
            </Badge> */}
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Quick Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search by location, property type, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer bg-blue-800 hover:bg-[#1D4ED8] text-white disabled:opacity-50 mt-0 md:mt-0 ml-0 md:ml-4"
              >
                {loading ? "Searching..." : "Search Properties"}
              </Button>
              <Button
                type="button"
                variant="default"
                className="cursor-pointer gap-2"
              >
                Save Search
              </Button>
              <Button
                variant="outline"
                type="button"
                className="gap-2 cursor-pointer"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showAdvancedFilters ? "Hide Filters" : "Advanced Filters"}
              </Button>
            </div>
          </form>
        </div>

        {/* Advanced Search Form */}
        {showAdvancedFilters && states && propertyTypes && agencies && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <PropertySearchForm
              propertyTypes={propertyTypes}
              states={states}
              agencies={agencies}
              preSelectedCategory={upFor}
              onSendData={handleChildData}
              setLoader={setLoading}
              loader={loading}
            />
          </div>
        )}

        {/* Search Results */}
        <div className="bg-white rounded-lg shadow-lg p-6 h-auto mb-8">
          <div
            className="w-fit bg-white p-1 mb-4 text-black rounded-full shadow-sm cursor-pointer"
            onClick={() => router.back()}
          >
            <ChevronLeft />
          </div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">
                Search Results
              </h2>
              <p className="text-gray-600">
                Found <b>({pagination.totalCount ?? 0})</b> properties matching
                your criteria
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={sortByPrice}>
                Sort by Price
              </Button>
              <Button variant="outline" size="sm" onClick={sortByDate}>
                Sort by Date
              </Button>
            </div>
          </div>
          {loading && <SearchResultsLoaderCard />}

          {searchResults.length <= 0 && !loading ? (
            <div className="text-center text-gray-500">
              No properties found. Try adjusting your search criteria
            </div>
          ) : (
            <>
              <SearchResultsList
                data={
                  searchResults
                    ? searchResults
                    : ([] as SearchPropertyInterfaceType[])
                }
              />
              {pagination?.currentPage && (
                <DynamicPagination
                  currentPage={pagination?.currentPage}
                  totalPages={pagination?.totalPages}
                  hasNext={pagination?.hasNext}
                  hasPrevious={pagination?.hasPrevious}
                  onPageChange={loadData}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
