'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";
import PropertySearchForm from "./search-form";
import SearchResultsList from "./results";
import { useRouter } from "next/navigation";

const SearchResults = () => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
      const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100">
        <Navbar/>
        <div className="relative h-[200px] bg-gradient-to-r from-navy-900 to-navy-800 mt-16">
            {/* <div className="w-fit bg-white p-1 text-black rounded-full shadow-sm cursor-pointer"
                onClick={() => router.back()}>
                <ArrowLeft/>
            </div> */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                Search Properties
            </h1>
            {/* <Badge variant="secondary" className="text-base shadow">
                Find Your Perfect Home
            </Badge> */}
            </div>
        </div>

        <div className="container mx-auto px-4 -mt-16 relative z-10">
            {/* Quick Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
                <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                <SlidersHorizontal className="h-4 w-4" />
                {showAdvancedFilters ? "Hide Filters" : "Advanced Filters"}
                </Button>
                <Button className="bg-real-600 hover:bg-real-700">
                Search Properties
                </Button>
            </div>
            </div>

            {/* Advanced Search Form */}
            {showAdvancedFilters && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <PropertySearchForm />
            </div>
            )}

            {/* Search Results */}
            <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                <h2 className="text-2xl font-bold text-navy-900">Search Results</h2>
                <p className="text-gray-600">Found 24 properties matching your criteria</p>
                </div>
                <div className="flex gap-2">
                <Button variant="outline" size="sm">Sort by Price</Button>
                <Button variant="outline" size="sm">Sort by Date</Button>
                </div>
            </div>
            <SearchResultsList />
            </div>
        </div>
      <Footer/>
    </div>
  );
};

export default SearchResults;