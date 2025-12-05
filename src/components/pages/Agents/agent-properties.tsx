'use client';
import React, { useState } from "react";
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
  Award,
  Building,
} from "lucide-react";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";

// Mock agent data
const agents = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    title: "Senior Real Estate Agent",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    reviewCount: 127,
    totalSales: 2500000,
    propertiesSold: 45,
    activeListings: 12,
    yearsExperience: 8,
    location: "Downtown District",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@abode.com",
    specialties: ["Luxury Homes", "Commercial Properties", "Investment Properties"],
    bio: "Sarah is a dedicated real estate professional with over 8 years of experience in luxury and commercial properties.",
    available: true,
  },
  {
    id: 2,
    firstName: "David",
    lastName: "Martinez",
    title: "Property Investment Specialist",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 4.8,
    reviewCount: 89,
    totalSales: 1800000,
    propertiesSold: 32,
    activeListings: 8,
    yearsExperience: 6,
    location: "Business District",
    phone: "+1 (555) 234-5678",
    email: "david.martinez@abode.com",
    specialties: ["Investment Properties", "Market Analysis", "First-Time Buyers"],
    bio: "David specializes in investment properties and helps clients build their real estate portfolios.",
    available: true,
  },
  {
    id: 3,
    firstName: "Emily",
    lastName: "Thompson",
    title: "Residential Sales Expert",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 4.9,
    reviewCount: 156,
    totalSales: 3200000,
    propertiesSold: 67,
    activeListings: 15,
    yearsExperience: 10,
    location: "Suburban Areas",
    phone: "+1 (555) 345-6789",
    email: "emily.thompson@abode.com",
    specialties: ["Family Homes", "First-Time Buyers", "Relocation Services"],
    bio: "Emily has been helping families find their perfect homes for over a decade.",
    available: true,
  },
  {
    id: 4,
    firstName: "Michael",
    lastName: "Chen",
    title: "Commercial Real Estate Agent",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.7,
    reviewCount: 74,
    totalSales: 5600000,
    propertiesSold: 28,
    activeListings: 6,
    yearsExperience: 12,
    location: "Financial District",
    phone: "+1 (555) 456-7890",
    email: "michael.chen@abode.com",
    specialties: ["Commercial Properties", "Office Buildings", "Retail Spaces"],
    bio: "Michael is a commercial real estate expert with extensive experience in office buildings.",
    available: false,
  },
  {
    id: 5,
    firstName: "Jessica",
    lastName: "Williams",
    title: "Luxury Home Specialist",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    rating: 4.8,
    reviewCount: 93,
    totalSales: 4100000,
    propertiesSold: 38,
    activeListings: 9,
    yearsExperience: 7,
    location: "Upscale Neighborhoods",
    phone: "+1 (555) 567-8901",
    email: "jessica.williams@abode.com",
    specialties: ["Luxury Homes", "Waterfront Properties", "Estate Sales"],
    bio: "Jessica specializes in luxury and waterfront properties.",
    available: true,
  },
  {
    id: 6,
    firstName: "Robert",
    lastName: "Davis",
    title: "New Construction Specialist",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 4.6,
    reviewCount: 61,
    totalSales: 2800000,
    propertiesSold: 34,
    activeListings: 11,
    yearsExperience: 9,
    location: "Development Areas",
    phone: "+1 (555) 678-9012",
    email: "robert.davis@abode.com",
    specialties: ["New Construction", "Custom Homes", "Builder Relations"],
    bio: "Robert works exclusively with new construction and custom homes.",
    available: true,
  },
];

// Mock properties data
const generatePropertiesForAgent = (agentId: number) => {
  const baseProperties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      price: "$1,250,000",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
      location: "Beverly Hills, CA",
      beds: 4,
      baths: 3,
      sqft: "3,500",
      type: "For Sale",
    },
    {
      id: 2,
      title: "Downtown Apartment",
      price: "$450,000",
      image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80",
      location: "Downtown Seattle, WA",
      beds: 2,
      baths: 2,
      sqft: "1,200",
      type: "For Sale",
    },
    {
      id: 3,
      title: "Suburban Family Home",
      price: "$750,000",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
      location: "Bellevue, WA",
      beds: 4,
      baths: 2.5,
      sqft: "2,800",
      type: "For Sale",
    },
    {
      id: 4,
      title: "Waterfront Condo",
      price: "$890,000",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
      location: "Miami Beach, FL",
      beds: 3,
      baths: 2,
      sqft: "1,800",
      type: "For Sale",
    },
    {
      id: 5,
      title: "Mountain Retreat",
      price: "$1,100,000",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80",
      location: "Aspen, CO",
      beds: 5,
      baths: 4,
      sqft: "4,200",
      type: "For Sale",
    },
    {
      id: 6,
      title: "City Penthouse",
      price: "$2,500,000",
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80",
      location: "New York, NY",
      beds: 3,
      baths: 3,
      sqft: "2,500",
      type: "For Sale",
    },
    {
      id: 7,
      title: "Ranch Style Home",
      price: "$650,000",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
      location: "Austin, TX",
      beds: 4,
      baths: 2,
      sqft: "2,400",
      type: "For Sale",
    },
    {
      id: 8,
      title: "Historic Brownstone",
      price: "$1,800,000",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      location: "Boston, MA",
      beds: 4,
      baths: 3,
      sqft: "3,200",
      type: "For Sale",
    },
  ];

  // Return different number of properties based on agent
  const count = (agentId % 3) + 6; // Returns 6-8 properties
  return baseProperties.slice(0, count);
};

const ITEMS_PER_PAGE = 6;

const AgentProperties = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  console.log({id : searchParams.get("id")});
  const router  = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const agent = agents.find((a) => a.id === Number(2));
  const properties = agent ? generatePropertiesForAgent(agent.id) : [];

  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = properties.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!agent) {
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
        <section className="mt-16 relative py-12 bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10 mb-6"
              onClick={() => router.push("/agents")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white/20 shadow-2xl">
                  <AvatarImage src={agent.avatar} alt={`${agent.firstName} ${agent.lastName}`} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-blue-600 text-white">
                    {agent.firstName[0]}{agent.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-3 border-white shadow-lg ${
                    agent.available ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {agent.firstName} {agent.lastName}
                  </h1>
                  <Badge
                    variant={agent.available ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {agent.available ? "Available" : "Busy"}
                  </Badge>
                </div>
                <p className="text-lg text-white/80 mb-4">{agent.title}</p>

                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{agent.rating}</span>
                    <span className="text-white/60">({agent.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{agent.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>{agent.yearsExperience} years experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agent Details Section */}
        <section className="py-6 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{agent.email}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {agent.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/5">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="mt-4 text-muted-foreground max-w-3xl">{agent.bio}</p>

            {/* Agent Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{agent.propertiesSold}</div>
                <div className="text-sm text-muted-foreground">Properties Sold</div>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  ${(agent.totalSales / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-muted-foreground">Total Sales</div>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{agent.activeListings}</div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{agent.yearsExperience}</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
        </section>

        {/* Properties Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Properties by {agent.firstName}
                </h2>
              </div>
              <Badge variant="secondary" className="text-sm">
                {properties.length} Properties
              </Badge>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
                  <Building className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-muted-foreground mb-2">No properties</h3>
                  <p className="text-muted-foreground">This agent has no active listings.</p>
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
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-4 left-4 bg-primary">{property.type}</Badge>
                        <Badge className="absolute top-4 right-4 bg-white text-foreground shadow-lg">
                          {property.price}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground border-t pt-4">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span className="text-sm">{property.beds} beds</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span className="text-sm">{property.baths} baths</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            <span className="text-sm">{property.sqft} sqft</span>
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