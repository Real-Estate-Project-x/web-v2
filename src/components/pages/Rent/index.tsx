'use client';

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PropertyFilter, PropertyList } from "../Properties";
import { Fragment, useEffect, useState } from "react";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";
import { PropertyInterface } from "../../../../utils/interfaces";
import { API_BASE_URL } from "../home";
import axios from "axios";
import LoadingCard from "@/components/shared/loader-cards";
import { Pagination } from "@/components/shared/pagination";

const PropertiesForRent = () => {

    const [rentProperties, setRentProperties] = useState<PropertyInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}property/customer-listings/by-property-action/RENT`)
        .then((response) => { 
            if(response.data.success) {
                setRentProperties(response.data.data);

            }
            setIsLoading(false);
        })
        .catch((error) => {
            setIsLoading(false);
            console.error("Error fetching properties:", error);
        });
    },[]);


    return (
        <Fragment>
            <Navbar/>

            <div className="min-h-screen bg-gray-50">
                <div className="relative h-[300px] bg-[#0253CC] mt-16">
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative">
                    <h1 className="text-4xl md:text-5xl font-light text-white mb-4 text-center">
                        Properties For Rent
                    </h1>
                    <Badge variant="secondary"  className="text-lg px-4 py-3 rounded-full font-light mt-2">
                        Find Your Dream Apartment
                    </Badge>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-8 relative z-10">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Search by location, property type..."
                                className="w-full pl-10"
                            />
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            </div>
                            <PropertyFilter />
                        </div>
                    </div>

                    {isLoading ? (
                        <LoadingCard/>
                    ) : rentProperties?.length === 0 ? 
                        <div className="text-center text-gray-500">
                            <p className="text-lg">No properties available for Rent at the moment.</p>
                        </div>
                    :(
                        <PropertyList array={rentProperties} />
                    )}
                    {/* <PropertyList array={[]} /> */}
                </div>

                {rentProperties.length > 6 && (<Pagination _data={rentProperties} />)}
            </div>

            <Footer/>
        </Fragment>
    );
};

export default PropertiesForRent;
