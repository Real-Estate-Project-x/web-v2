'use client';

import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Navbar from "../Home/Nav";
import AgentFilters from "./filters";
import AgentCard from "./Agent-Card";
import AgentListItem from "./listitem";
import Footer from "../Home/Footer";
import axios from "axios";
import { API_BASE_URL } from "../home";
import { returnHeaders } from "@/lib/utils";
import { AgentInitialObject, AgentInterface } from "../../../../utils/interfaces";

const Agents = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");
  const [data, setData] = useState<AgentInterface[]>([{...AgentInitialObject}] as AgentInterface[]);
  const [errorMsg, setErrorObj] = useState<{msg : string, flag : boolean}>();

  // const agents = [
  //   {
  //     id: 1,
  //     firstName: "Sarah",
  //     lastName: "Johnson",
  //     title: "Senior Real Estate Agent",
  //     avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  //     rating: 4.9,
  //     reviewCount: 127,
  //     totalSales: 2500000,
  //     propertiesSold: 45,
  //     activeListings: 12,
  //     yearsExperience: 8,
  //     location: "Downtown District",
  //     phone: "+1 (555) 123-4567",
  //     email: "sarah.johnson@abode.com",
  //     specialties: ["Luxury Homes", "Commercial Properties", "Investment Properties"],
  //     languages: ["English", "Spanish"],
  //     certifications: ["CRS", "GRI", "ABR"],
  //     bio: "Sarah is a dedicated real estate professional with over 8 years of experience in luxury and commercial properties. She has helped hundreds of clients find their dream homes.",
  //     achievements: ["Top Agent 2023", "Million Dollar Club", "Client Choice Award"],
  //     responseTime: "< 1 hour",
  //     commission: "2.5%",
  //     available: true
  //   },
  //   {
  //     id: 2,
  //     firstName: "David",
  //     lastName: "Martinez",
  //     title: "Property Investment Specialist",
  //     avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  //     rating: 4.8,
  //     reviewCount: 89,
  //     totalSales: 1800000,
  //     propertiesSold: 32,
  //     activeListings: 8,
  //     yearsExperience: 6,
  //     location: "Business District",
  //     phone: "+1 (555) 234-5678",
  //     email: "david.martinez@abode.com",
  //     specialties: ["Investment Properties", "Market Analysis", "First-Time Buyers"],
  //     languages: ["English", "Portuguese"],
  //     certifications: ["CCIM", "CRS"],
  //     bio: "David specializes in investment properties and helps clients build their real estate portfolios with strategic market analysis and expert guidance.",
  //     achievements: ["Rising Star 2023", "Investment Expert Award"],
  //     responseTime: "< 2 hours",
  //     commission: "2.75%",
  //     available: true
  //   },
  //   {
  //     id: 3,
  //     firstName: "Emily",
  //     lastName: "Thompson",
  //     title: "Residential Sales Expert",
  //     avatar: "https://randomuser.me/api/portraits/women/63.jpg",
  //     rating: 4.9,
  //     reviewCount: 156,
  //     totalSales: 3200000,
  //     propertiesSold: 67,
  //     activeListings: 15,
  //     yearsExperience: 10,
  //     location: "Suburban Areas",
  //     phone: "+1 (555) 345-6789",
  //     email: "emily.thompson@abode.com",
  //     specialties: ["Family Homes", "First-Time Buyers", "Relocation Services"],
  //     languages: ["English", "French"],
  //     certifications: ["ABR", "GRI", "SRS"],
  //     bio: "Emily has been helping families find their perfect homes for over a decade. She specializes in residential sales and relocation services.",
  //     achievements: ["Top Producer 2023", "Family Choice Award", "Excellence in Service"],
  //     responseTime: "< 30 minutes",
  //     commission: "2.5%",
  //     available: true
  //   },
  //   {
  //     id: 4,
  //     firstName: "Michael",
  //     lastName: "Chen",
  //     title: "Commercial Real Estate Agent",
  //     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  //     rating: 4.7,
  //     reviewCount: 74,
  //     totalSales: 5600000,
  //     propertiesSold: 28,
  //     activeListings: 6,
  //     yearsExperience: 12,
  //     location: "Financial District",
  //     phone: "+1 (555) 456-7890",
  //     email: "michael.chen@abode.com",
  //     specialties: ["Commercial Properties", "Office Buildings", "Retail Spaces"],
  //     languages: ["English", "Mandarin"],
  //     certifications: ["CCIM", "SIOR"],
  //     bio: "Michael is a commercial real estate expert with extensive experience in office buildings and retail spaces in the financial district.",
  //     achievements: ["Commercial Expert 2023", "Deal of the Year Award"],
  //     responseTime: "< 1 hour",
  //     commission: "3.0%",
  //     available: false
  //   },
  //   {
  //     id: 5,
  //     firstName: "Jessica",
  //     lastName: "Williams",
  //     title: "Luxury Home Specialist",
  //     avatar: "https://randomuser.me/api/portraits/women/28.jpg",
  //     rating: 4.8,
  //     reviewCount: 93,
  //     totalSales: 4100000,
  //     propertiesSold: 38,
  //     activeListings: 9,
  //     yearsExperience: 7,
  //     location: "Upscale Neighborhoods",
  //     phone: "+1 (555) 567-8901",
  //     email: "jessica.williams@abode.com",
  //     specialties: ["Luxury Homes", "Waterfront Properties", "Estate Sales"],
  //     languages: ["English"],
  //     certifications: ["CLHMS", "CRS"],
  //     bio: "Jessica specializes in luxury and waterfront properties, providing exceptional service to high-end clients seeking premium real estate.",
  //     achievements: ["Luxury Agent 2023", "Waterfront Specialist Award"],
  //     responseTime: "< 45 minutes",
  //     commission: "2.8%",
  //     available: true
  //   },
  //   {
  //     id: 6,
  //     firstName: "Robert",
  //     lastName: "Davis",
  //     title: "New Construction Specialist",
  //     avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  //     rating: 4.6,
  //     reviewCount: 61,
  //     totalSales: 2800000,
  //     propertiesSold: 34,
  //     activeListings: 11,
  //     yearsExperience: 9,
  //     location: "Development Areas",
  //     phone: "+1 (555) 678-9012",
  //     email: "robert.davis@abode.com",
  //     specialties: ["New Construction", "Custom Homes", "Builder Relations"],
  //     languages: ["English"],
  //     certifications: ["New Home Sales"],
  //     bio: "Robert works exclusively with new construction and custom homes, maintaining strong relationships with local builders and developers.",
  //     achievements: ["New Home Expert 2023", "Builder Partnership Award"],
  //     responseTime: "< 3 hours",
  //     commission: "2.5%",
  //     available: true
  //   }
  // ];

  const filteredAgents = data?.filter(agent => {
    const matchesSearch = 
      agent?.agency?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      // agent.specialties.some(specialty => 
      //   specialty.toLowerCase().includes(searchTerm.toLowerCase())
      // ) ||
      agent?.agency?.address?.toLowerCase()?.includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterBy === "all" ||
      (filterBy === "available" && agent?.agency.status);
      // (filterBy === "luxury" && agent.specialties.includes("Luxury Homes")) ||
      // (filterBy === "commercial" && agent.specialties.includes("Commercial Properties")) ||
      // (filterBy === "investment" && agent.specialties.includes("Investment Properties"));
    
    return matchesSearch && matchesFilter;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b?.agency.rating - a?.agency.rating;
      case "experience":
        // Uncomment and use if yearsExperience is available
        // return b.yearsExperience - a.yearsExperience;
        return 0;
      case "name":
        return a?.agency.name.localeCompare(b?.agency.name);
      default:
        return 0;
    }
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}agency/customer-listings/agents-list`, {headers : returnHeaders()})
    .then((response) => {
      if(response.data.success){
        setData(response.data.data);
      }else{
        setErrorObj({...errorMsg, flag : true, msg : response.data.message});
      }
    }).catch((err) => {
        setErrorObj({...errorMsg, flag : true, msg : err?.response?.data?.message});
      console.log({err});
    })
  },[]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 */}
        <section className="relative bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 py-16 overflow-hidden ">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mt-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-6">
                Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Expert Agents</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Connect with experienced real estate professionals who deliver exceptional results and personalized service.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">{data.length}</div>
                  <div className="text-sm text-white/80">Expert Agents</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">
                    {/* {data.reduce((sum, agent) => sum + agent.propertiesSold, 0)} */}
                  </div>
                  <div className="text-sm text-white/80">Properties Sold</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">
                    {/* ${(data.reduce((sum, agent) => sum + agent.totalSales, 0) / 1000000).toFixed(0)}M */}
                  </div>
                  <div className="text-sm text-white/80">Total Sales</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">
                    {(data.reduce((sum, agent) => sum + agent?.agency?.rating, 0) / data.length).toFixed(1)}
                  </div>
                  <div className="text-sm text-white/80">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <AgentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalAgents={data.length}
          filteredCount={sortedAgents.length}
          availableCount={data.filter(a => a?.agency?.status).length}
        />

        {/* Agents Grid/List */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedAgents.map((agent) => (
                  <AgentCard key={agent?.agency.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-w-6xl mx-auto">
                {sortedAgents.map((agent) => (
                  <AgentListItem key={agent?.agency.id} agent={agent} />
                ))}
              </div>
            )}
            
            {sortedAgents.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No agents found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Agents;