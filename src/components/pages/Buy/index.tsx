'use client';

import { Fragment } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PropertyFilter, PropertyList } from "../Properties";
import { properties } from "../Home/Featured-properties";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";

const PropertiesForSale = () => {
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

                <PropertyList array={properties} />
            </div>
        </div>

        <Footer/>
    </Fragment>
  );
};

export default PropertiesForSale;
