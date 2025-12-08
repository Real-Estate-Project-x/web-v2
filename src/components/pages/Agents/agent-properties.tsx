'use client';
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Bed,
  Bath,
  Square,
  ArrowLeft,
  Building,
  Search,
  SlidersHorizontal,
  Calendar
} from "lucide-react";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";
import { axiosInstance } from "@/lib/axios-interceptor";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgencyInterface, PropertyInterface } from "../../../../utils/interfaces";
import { formatPrice } from "../../../../utils/helpers";


const ITEMS_PER_PAGE = 6;

const AgentProperties = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router  = useRouter();
  const [agency, setAgency] = useState<AgencyInterface>({} as AgencyInterface);

  const [currentPage, setCurrentPage] = useState(1);
   const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [bedroomFilter, setBedroomFilter] = useState("all");

  const allProperties = agency && agency?.properties ? agency?.properties : []; //agent ? generatePropertiesForAgent(agent.id) : [];

  // Filter properties based on search and filters
  const filteredProperties = allProperties.filter((property : PropertyInterface) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = propertyType === "all" || property?.propertyType?.name === propertyType;

    const priceNum = property?.price;
    let matchesPrice = true;
    if (priceRange === "under500k") matchesPrice = priceNum < 500000;
    else if (priceRange === "500k-1m") matchesPrice = priceNum >= 500000 && priceNum < 1000000;
    else if (priceRange === "1m-2m") matchesPrice = priceNum >= 1000000 && priceNum < 2000000;
    else if (priceRange === "over2m") matchesPrice = priceNum >= 2000000;

    let matchesBedrooms = true;
    if (bedroomFilter === "1-2") matchesBedrooms = property?.noOfBedrooms >= 1 && property.noOfBedrooms <= 2;
    else if (bedroomFilter === "3-4") matchesBedrooms = property.noOfBedrooms >= 3 && property.noOfBedrooms <= 4;
    else if (bedroomFilter === "5+") matchesBedrooms = property.noOfBedrooms >= 5;

    return matchesSearch && matchesType && matchesPrice && matchesBedrooms;
  });

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPropertyType("all");
    setPriceRange("all");
    setBedroomFilter("all");
    setCurrentPage(1);
  };

  useEffect(() => {
    axiosInstance.get(`/agency/${id}`)
    .then((response) => {
      setAgency(response.data.data);
    }).catch((error) => {
      console.error("Error fetching agency:", error);
    })

    // axiosInstance.get(`/agency/${id}/properties`)
    // .then((response) => {
    //   console.log('Fetched properties:', response.data);
    // }).catch((error) => {
    //   console.error("Error fetching properties:", error);
    // })
  },[]);
  
  if (!agency) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Agent Not Found</h1>
            <Button onClick={() => router.push("/agents")}>Back to Agents</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />

      <main className="flex-1">
        {/* Agent Header Section */}
        <section className="mt-8 relative py-12 bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10 mb-6"
              onClick={() => router.push("/agents")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white/20 shadow-2xl">
                  <AvatarImage src={agency?.createdByUser?.profileImage} alt={`${agency?.createdByUser?.firstName} ${agency?.createdByUser?.lastName}`} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-blue-600 text-white">
                    {agency?.createdByUser?.firstName}{agency?.createdByUser?.lastName}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-3 border-white shadow-lg ${
                    agency?.isRegistered ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
                    {agency?.name}
                  </h1>
                  <Badge
                    className={`${agency?.isRegistered  ? "bg-green-600 text-white" : "bg-gray-500 text-white"} text-sm py-2 rounded-full`}>
                    {agency?.isRegistered ? "Registered" : "Not-Registered"}
                  </Badge>
                </div>
                <p className="text-lg text-white/80 capitalize">{agency?.description}</p>
                <div className="flex flex-wrap items-center gap-6 my-2">
                  <div className="flex items-center gap-2 text-white">
                    <Phone className="h-4 w-4" />
                    <span>{agency?.agencyPhoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Mail className="h-4 w-4" />
                    <span>{agency?.email}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{agency?.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 capitalize">
                    <MapPin className="h-4 w-4" />
                    <span>{agency?.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined Since {new Date(agency?.dateOfIncorporation).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Properties Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground capitalize">
                  Properties by {agency?.name}
                </h2>
              </div>
              <Badge variant="secondary" className="text-sm">
                {filteredProperties.length} of {allProperties.length} Properties
              </Badge>
            </div>

             {/* Search and Filter Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-8 border border-border/50 shadow-sm">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by property name or location..."
                    value={searchQuery}
                    onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                    className="pl-10 bg-white border-border/50"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="font-medium">Filters:</span>
                  </div>

                  <div className="flex flex-wrap gap-3 flex-1">
                    <Select value={propertyType} onValueChange={(value) => handleFilterChange(setPropertyType, value)}>
                      <SelectTrigger className="w-full sm:w-[140px] bg-white border-border/50">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="For Sale">For Sale</SelectItem>
                        <SelectItem value="For Rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={priceRange} onValueChange={(value) => handleFilterChange(setPriceRange, value)}>
                      <SelectTrigger className="w-full sm:w-[160px] bg-white border-border/50">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="under500k">Under ₦500K</SelectItem>
                        <SelectItem value="500k-1m">₦500K - ₦1M</SelectItem>
                        <SelectItem value="1m-2m">₦1M - ₦2M</SelectItem>
                        <SelectItem value="over2m">Over ₦2M</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={bedroomFilter} onValueChange={(value) => handleFilterChange(setBedroomFilter, value)}>
                      <SelectTrigger className="w-full sm:w-[140px] bg-white border-border/50">
                        <SelectValue placeholder="Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Beds</SelectItem>
                        <SelectItem value="1-2">1-2 Beds</SelectItem>
                        <SelectItem value="3-4">3-4 Beds</SelectItem>
                        <SelectItem value="5+">5+ Beds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(searchQuery || propertyType !== "all" || priceRange !== "all" || bedroomFilter !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
                  <Building className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                   <h3 className="text-2xl font-bold text-muted-foreground mb-2">
                    {allProperties.length === 0 ? "No properties" : "No matching properties"}
                  </h3>
                  <p className="text-muted-foreground">
                    {allProperties.length === 0
                      ? "This agent has no active listings."
                      : "Try adjusting your search or filters."}
                  </p>
                  {allProperties.length > 0 && (
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProperties.map((property) => (
                    <Card
                      key={property.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white cursor-pointer group"
                      onClick={() => router.push(`/properties/view?id=${property.id}`)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={property.photoUrls && property.photoUrls.length > 0 ? property.photoUrls[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-4 left-4 bg-primary">{property?.propertyType?.name}</Badge>
                        <Badge className="absolute top-4 right-4 bg-white text-foreground shadow-lg">
                          {formatPrice(property.price)}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property?.address}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground border-t pt-4">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span className="text-sm">{property?.noOfBedrooms} beds</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span className="text-sm">{property?.noOfToilets} baths</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            <span className="text-sm">{property.sizeInSquareFeet} sqft</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AgentProperties;