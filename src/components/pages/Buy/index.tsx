'use client';

import { Fragment, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PropertyFilter, PropertyList } from "../Properties";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";
import { PropertyInterface } from "../../../../utils/interfaces";
import axios from "axios";
import { API_BASE_URL } from "../home";
import LoadingCard from "@/components/shared/loader-cards";
import { Pagination } from "@/components/shared/pagination";

const PropertiesForSale = () => {
    
    const [buyProperties, setBuyProperties] = useState<PropertyInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}property?upFor=SALE`)
        .then((response) => { 
            if(response.data.success) {
                setBuyProperties(response.data.data);

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

        <div className="min-h-screen">
            <div className="relative h-[300px] bg-gradient-to-r bg-[#1E3A8A] mt-16">
                <div className="absolute inset-0 bg-black/50" />
                <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative">
                <h1 className="text-4xl md:text-5xl font-light text-white mb-4 text-center">
                    Properties For Sale
                </h1>
                <Badge variant="secondary" className="text-lg px-4 py-3 rounded-full font-light mt-2">
                    Find Your Dream Home
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
                ) : buyProperties?.length === 0 ? 
                    <div className="text-center text-gray-500">
                        <p className="text-lg">No properties available for sale at the moment.</p>
                    </div>
                :(
                    <PropertyList array={buyProperties} />
                )}
            </div>

            {buyProperties.length > 6 && (<Pagination _data={buyProperties} />)}
        </div>

        <Footer/>
    </Fragment>
  );
};

export default PropertiesForSale;
