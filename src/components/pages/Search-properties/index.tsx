'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {ChevronLeft, Search, SlidersHorizontal } from "lucide-react";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";
import PropertySearchForm from "./search-form";
import SearchResultsList from "./results";
import { useRouter, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios-interceptor";
import { SearchPropertyInterfaceType } from "../../../../utils/interfaces";
import { SearchResultsLoaderCard } from "@/components/shared/loader-cards";
// import { Badge } from "@/components/ui/badge";

const SearchResults = () => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchPropertyInterfaceType[]>([] as SearchPropertyInterfaceType[]);
  const [loading, setLoading] = useState<boolean>(false);

  const filter = searchParams.get('filter') as string;
  const query = searchParams.get('query') as string;
  const [togglePrice , setTogglePrice] =  useState<boolean>(false);
  const [toggleDate, setToggleDate] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(filter);
  const [propertyType, setPropertyType] = useState<string>("");
  const [listingType, setListingType] = useState<string>(query);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [minPrice, setMinPrice] = useState<number>(100000);
  const [maxPrice, setMaxPrice] = useState<number>(50000000);
  const [sizeRange, setSizeRange] = useState<number[]>([500, 5000]);
  const [kidsArea, setkidsArea] = useState<boolean>(false);
  const [hasWifi, setHasWifi] = useState<boolean>(false);
  const [carParking, setCarParking] = useState<boolean>(false); 
  const [hasGym, setHasGym] = useState<boolean>(false);
  const [hasLaundry, setHasLaundry] = useState<boolean>(false);
  const [hasCCTV, setHasCCTV] = useState<boolean>(false);
  const [isNewBuilding, setIsNewBuilding] = useState<boolean>(false);
  const [isPetFriendly, setIsPetFriendly] = useState<boolean>(false);
  

  //how to sort by price
  const sortByPrice = () => {
    const sortedData = [...searchResults].sort((a, b) => { 
      if(togglePrice) {
        return (b?.property?.price || 0) - (a?.property?.price || 0);
      }
      return (a?.property?.price || 0) - (b?.property?.price || 0);
    
    });
    setTogglePrice(!togglePrice);
    setSearchResults(sortedData);
  }

  //sorting by date in ascending and descending order
    const sortByDate = () => {      
        const sortedData = [...searchResults].sort((a, b) => {  
            if(toggleDate) {        
                return new Date(b?.property?.dateCreated || "").getTime() - new Date(a?.property?.dateCreated || "").getTime();
            }   
            return new Date(a?.property?.dateCreated || "").getTime() - new Date(b?.property?.dateCreated || "").getTime();
        });
        setToggleDate(!toggleDate);
        setSearchResults(sortedData);
    } 

    const getSearchResults = async (filter : string, query : string, hasMoreFilters = false) => {
        //const hasMoreFilters = moreFilters && Object.keys(moreFilters).length > 0;

        const payload = hasMoreFilters
            ? {
            propertyTypeId:"",
            upFor: filter,
            searchTerm:query,
            pricing: {
                start: parseInt(minPrice.toString()),
                end: parseInt(maxPrice.toString()) 
            },
            numberOfBeds: bedrooms,
            numberOfToilets: bathrooms,
            isNewBuilding,
            isPetFriendly,
            hasWifi,
            hasLaundry,
            hasCarParking: carParking,
            hasKidsPlayArea: kidsArea,
            hasCctv: hasCCTV,
            hasGym,
            // squareFootage: {
            //     start: sizeRange[0],
            //     end: sizeRange[1]
            // }
            }
            : {
            propertyTypeId: "",
            upFor: filter,
            searchTerm: query
            };

        await axiosInstance.post(`/property/customer-listings/global-search`, payload
        ).then((response) => {   
            if(response.data.success) {
                setSearchResults(response.data.data || [] as SearchPropertyInterfaceType[]);
            }
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            console.error("Error fetching search results:", error);
        });
    }
    const handleAdvancedSearch = async (e : React.FormEvent) => {
        e.preventDefault();
         setLoading(true);
        await getSearchResults(filter, searchQuery);
    }

    // const handleAdvancedFilter = () => {
    //     setLoading(true);
    //     console.log('clicked')
    //    // await getSearchResults(inputValue ? inputValue : filter, listingType ? listingType : query, true);
    // }
  useEffect(() => {
    const query = searchParams.get('query') as string;
    const filter = searchParams.get('filter') as string;
    getSearchResults(filter, query);
  }, [searchParams]);


  return (
    <div className="min-h-screen bg-slate-100">
        <Navbar/>
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
                <form onSubmit={handleAdvancedSearch}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Search by location, property type, or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10"
                            />
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        </div>

                        <Button  type="submit" disabled={loading} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white disabled:opacity-50 mt-0 md:mt-0 ml-0 md:ml-4">
                            {loading ? "Searching..." :"Search Properties"}
                        </Button>
                        <Button 
                            variant="outline" 
                            type="button"
                            className="gap-2"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                            <SlidersHorizontal className="h-4 w-4" />
                            {showAdvancedFilters ? "Hide Filters" : "Advanced Filters"}
                        </Button>
                    
                    </div>
                </form>
            </div>

            {/* Advanced Search Form */}
            {showAdvancedFilters && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <PropertySearchForm 
                    setInputValue={setInputValue}
                    setPropertyType={setPropertyType}
                    setListingType ={setListingType}
                    setBedrooms ={setBedrooms}
                    setBathrooms ={setBathrooms}
                    setMinPrice ={setMinPrice}
                    setMaxPrice ={setMaxPrice}
                    sizeRange ={sizeRange}
                    setSizeRange ={setSizeRange}
                    setKidsArea ={setkidsArea}
                    setHasWifi ={setHasWifi}
                    setCarParking ={setCarParking}
                    setHasGym ={setHasGym}
                    setHasLaundry ={setHasLaundry}
                    setHasCCTV ={setHasCCTV}
                    setIsNewBuilding ={setIsNewBuilding}
                    setIsPetFriendly ={setIsPetFriendly}
                    loader={loading}
                    inputValue={inputValue}
                    listingType={listingType}
                    setLoader={setLoading}
                    // propertyType={propertyType}
                    onSubmit={getSearchResults}
                />
            </div>
            )}

            {/* Search Results */}

            <div className="bg-white rounded-lg shadow-lg p-6 h-auto mb-8">
                <div className="w-fit bg-white p-1 mb-4 text-black rounded-full shadow-sm cursor-pointer"
                    onClick={() => router.back()}>
                    <ChevronLeft/>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-navy-900">Search Results</h2>
                        <p className="text-gray-600">Found {searchResults.length} properties matching your criteria</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm"
                        onClick={sortByPrice}>Sort by Price</Button>
                        <Button variant="outline" size="sm"
                        onClick={sortByDate}>Sort by Date</Button>
                    </div>
                </div>
                {loading && (
                    <SearchResultsLoaderCard/>
                )}

                {searchResults.length <= 0 && !loading ? (
                    <div className="text-center text-gray-500">
                        No properties found matching your criteria.
                    </div>
                ) : (
                    <SearchResultsList  data={searchResults ? searchResults : [] as SearchPropertyInterfaceType[]}/>
                )}
            </div>
        </div>
      <Footer/>
    </div>
  );
};

export default SearchResults;