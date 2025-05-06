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
import React, { FC, useState } from "react";
import { properties } from "../Home/Featured-properties";
import { Badge } from "@/components/ui/badge";
import { Bed, Building, MapPin } from "lucide-react";
import Footer from "../Home/Footer";
import { useRouter } from "next/navigation";
import MoreFiltersModal from "./Dialogs/more-filters";


type Props = {
    array : any[];
}

export const PropertyFilter = () => {

    const [moreFilterState, setMoreFilter] = useState<boolean>(false);

    return(
        <div className="flex flex-wrap gap-3">
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

            <Button variant="outline" className="gap-2"
            onClick={() => setMoreFilter(true)}>
                More Filters
            </Button>

        <MoreFiltersModal
            isOpen={moreFilterState} 
            onClose={() => setMoreFilter(false)} 
        />
        </div>

    );
}

export const PropertyList : FC<Props> = ({array}) => {

    const router = useRouter();

    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
            {array.map((property) => (
                <div key={property.id} className="property-card bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="relative h-64">
                        <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-[#0253CC] hover:bg-real-700">{property.type}</Badge>
                        {property.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                        </div>
                        <div className="absolute bottom-4 right-4">
                        <Badge className="bg-gray-100 text-navy-900">{property.price}</Badge>
                        </div>
                    </div>
                    <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2 text-navy-900">{property.title}</h3>
                        <div className="flex items-center mb-3 text-navy-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                        </div>
                        <div className="flex justify-between text-navy-600 border-t pt-3">
                        <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span className="text-sm">{property.beds} beds</span>
                        </div>
                        <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span className="text-sm">{property.baths} baths</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm">{property.sqft} sqft</span>
                        </div>
                        </div>
                        <Button 
                        variant="outline" 
                        className="w-full mt-4 border-real-500 text-real-600 hover:bg-real-50"
                        onClick={() => router.push(`/properties/view?id=${property.id}`)}
                        >
                        View Details
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

const Properties = () => {
    
  return (
    <React.Fragment>
        <Navbar/>
        <div className="mx-6 sm:mx-10 md:mx-16 mt-24 mb-10">
            <h2 className="text-4xl font-normal text-navy-900 pb-5 pb-4">Properties</h2>

            <PropertyFilter/>

            <PropertyList array={properties}/>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
                {properties.map((property) => (
                    <div key={property.id} className="property-card bg-white rounded-lg overflow-hidden shadow-md">
                        <div className="relative h-64">
                            <img 
                            src={property.image} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-real-600 hover:bg-real-700">{property.type}</Badge>
                            {property.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                            </div>
                            <div className="absolute bottom-4 right-4">
                            <Badge className="bg-white text-navy-900">{property.price}</Badge>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-semibold mb-2 text-navy-900">{property.title}</h3>
                            <div className="flex items-center mb-3 text-navy-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{property.location}</span>
                            </div>
                            <div className="flex justify-between text-navy-600 border-t pt-3">
                            <div className="flex items-center">
                                <Bed className="h-4 w-4 mr-1" />
                                <span className="text-sm">{property.beds} beds</span>
                            </div>
                            <div className="flex items-center">
                                <Building className="h-4 w-4 mr-1" />
                                <span className="text-sm">{property.baths} baths</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm">{property.sqft} sqft</span>
                            </div>
                            </div>
                            <Button 
                            variant="outline" 
                            className="w-full mt-4 border-real-500 text-real-600 hover:bg-real-50"
                            onClick={() => router.push(`/properties/view?id=${property.id}`)}
                            >
                            View Details
                            </Button>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
        
        <Footer/>
    </React.Fragment>
  );
};

export default Properties;
