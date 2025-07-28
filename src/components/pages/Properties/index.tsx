'use client';

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "../Home/Nav";
import React, { FC, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Bed, Building, MapPin, Search } from "lucide-react";
import Footer from "../Home/Footer";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { PropertyInterface } from "../../../../utils/interfaces";
import axios from "axios";
import { API_BASE_URL } from "../home";
import { formatPrice } from "../../../../utils/helpers";
import { Pagination } from "@/components/shared/pagination";
import LoadingCard from "@/components/shared/loader-cards";
import { returnHeaders } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios-interceptor";

type Props = {
    array : PropertyInterface[];
}

type FilterProps = {
    setData :Function,
    setLoader : Function,
    setType : Function
}
export const PropertyFilter :FC<FilterProps> = ({setData, setLoader, setType}) => {

    const [moreFilterState, setMoreFilter] = useState<boolean>(false);

    const onChangeHandler = (value : string) => {
       setType(value);
       filterProperties(value)
    }

    const filterProperties = async(type : string) => {
        await axiosInstance.get(`property/customer-listings/by-property-action/${type}`)
        .then((response) => { 
            if(response.data.success) {
                setData(response.data.data);
            }
            setLoader(false);
        })
        .catch((error) => {
            setLoader(false);
            console.error("Error fetching properties:", error);
        });
    } 

   
    return(
        <div className="w-full flex flex-wrap gap-3">
            <div className="w-full flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 relative flex-1">
                    <Input
                        type="text"
                        placeholder="Search by location, property type..."
                        className="w-full pl-10"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                <Select>
                    <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="0-500k">$0 - $500k</SelectItem>
                    <SelectItem value="500k-1m">$500k - $1M</SelectItem>
                    <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                    <SelectItem value="2m+">$2M+</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={(value : string) => onChangeHandler(value)}>
                    <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Property For?" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="RENT">{"RENT"}</SelectItem>
                    <SelectItem value="SALE">{"SALE"}</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="1">1+ Bed</SelectItem>
                    <SelectItem value="2">2+ Beds</SelectItem>
                    <SelectItem value="3">3+ Beds</SelectItem>
                    <SelectItem value="4">4+ Beds</SelectItem>
                    </SelectContent>
                </Select>

                {/* <Button variant="outline" className="gap-2"
                onClick={() => setMoreFilter(true)}>
                    More Filters
                </Button>

            <MoreFiltersModal
                isOpen={moreFilterState} 
                onClose={() => setMoreFilter(false)} 
            /> */}
            </div>
        </div>

    );
}

export const PropertyList : FC<Props> = ({array}) => {

    const router = useRouter();

    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
            {array.map((property) => (
                <div key={property.id} className="property-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:duration-200">
                    <div className="relative h-68">
                        <img 
                            src={property.photoUrls[0]} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-[#0253CC] hover:bg-real-700 capitalize">{new String(property.upFor).toLowerCase()}</Badge>
                            {property.isNewBuilding && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <Badge className="bg-gray-100 text-navy-900">{formatPrice(property.price)}</Badge>
                        </div>
                    </div>
                    <div className="p-5 capitalize">
                        <h3 className="text-xl font-semibold mb-2 text-navy-900">{property.title}</h3>
                        <div className="flex items-center mb-3 text-navy-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.address}</span>
                        </div>
                        <div className="flex justify-between text-navy-600 pt-3">
                            <div className="flex items-center">
                                <Bed className="h-4 w-4 mr-1" />
                                <span className="text-sm">{property.noOfBedrooms} beds</span>
                            </div>
                            <div className="flex items-center">
                                <Building className="h-4 w-4 mr-1" />
                                <span className="text-sm">{property.noOfToilets} toilets</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm">{property.sizeInSquareFeet} sqft</span>
                            </div>
                        </div>
                        <Button 
                        variant="outline" 
                        className="w-full mt-4 border-[#3B82F6] text-[#2563EB] hover:bg-real-50 cursor-pointer"
                        onClick={() => router.push(`/properties/view?id=${property.id}`)}>
                        View Details
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

const Properties = () => {
    const [properties, setProperties] = useState<PropertyInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [type, setType] = useState<string>("");

    useEffect(() => {
        axiosInstance.get(`property`)
        .then((response) => { 
            if(response.data.success) {
                setProperties(response.data.data);

            }
            setIsLoading(false);
        })
        .catch((error) => {
            setIsLoading(false);
            console.error("Error fetching properties:", error);
        });
    },[]);

   
  return (
    <React.Fragment>
        <Navbar/>
        <div className="mx-6 sm:mx-10 md:mx-16 mt-24 mb-10">
            {/* <h2 className="text-4xl font-normal text-navy-900 pb-5 pb-4">Properties</h2> */}
            <h1 className="text-4xl font-semibold text-navy-900 mt-4 mb-8">Find Your Dream Home</h1>

            <PropertyFilter setData={setProperties} setLoader={setIsLoading} setType={setType}/>

            {isLoading ? (
                <div className="flex justify-start">
                    <LoadingCard />
                </div>) 
                :
                (
                    properties?.length === 0 ? 
                        <div className="text-center text-gray-500">
                            <p className="text-lg pt-6">{(type && type.toLowerCase() ==="RENT" ||  type.toLowerCase() ==="SALE") ? `No properties for ${type} available at the moment` : "No properties available at the moment" }.</p>
                        </div>
                    :
                    <PropertyList array={properties}/>
                )
            }

            {properties.length > 6 && (<Pagination _data={properties} />)}
            

           
        </div>
        
        <Footer/>
    </React.Fragment>
  );
};

export default Properties;
