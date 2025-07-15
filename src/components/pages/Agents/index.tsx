'use client';

// import React, { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import { 
//   Search,
//   MapPin, 
//   Phone, 
//   Mail, 
//   Star,
//   Home,
//   DollarSign,
//   Users,
//   Award,
//   Filter,
//   Grid,
//   List,
//   TrendingUp
// } from "lucide-react";
// import Navbar from "../Home/Nav";
// import Footer from "../Home/Footer";

// const Agents = () => {
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("rating");
//   const [filterBy, setFilterBy] = useState("all");

//   const agents = [
//     {
//       id: 1,
//       firstName: "Sarah",
//       lastName: "Johnson",
//       title: "Senior Real Estate Agent",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//       rating: 4.9,
//       reviewCount: 127,
//       totalSales: 2500000,
//       propertiesSold: 45,
//       activeListings: 12,
//       yearsExperience: 8,
//       location: "Downtown District",
//       phone: "+1 (555) 123-4567",
//       email: "sarah.johnson@abode.com",
//       specialties: ["Luxury Homes", "Commercial Properties", "Investment Properties"],
//       languages: ["English", "Spanish"],
//       certifications: ["CRS", "GRI", "ABR"],
//       bio: "Sarah is a dedicated real estate professional with over 8 years of experience in luxury and commercial properties. She has helped hundreds of clients find their dream homes.",
//       achievements: ["Top Agent 2023", "Million Dollar Club", "Client Choice Award"],
//       responseTime: "< 1 hour",
//       commission: "2.5%",
//       available: true
//     },
//     {
//       id: 2,
//       firstName: "David",
//       lastName: "Martinez",
//       title: "Property Investment Specialist",
//       avatar: "https://randomuser.me/api/portraits/men/46.jpg",
//       rating: 4.8,
//       reviewCount: 89,
//       totalSales: 1800000,
//       propertiesSold: 32,
//       activeListings: 8,
//       yearsExperience: 6,
//       location: "Business District",
//       phone: "+1 (555) 234-5678",
//       email: "david.martinez@abode.com",
//       specialties: ["Investment Properties", "Market Analysis", "First-Time Buyers"],
//       languages: ["English", "Portuguese"],
//       certifications: ["CCIM", "CRS"],
//       bio: "David specializes in investment properties and helps clients build their real estate portfolios with strategic market analysis and expert guidance.",
//       achievements: ["Rising Star 2023", "Investment Expert Award"],
//       responseTime: "< 2 hours",
//       commission: "2.75%",
//       available: true
//     },
//     {
//       id: 3,
//       firstName: "Emily",
//       lastName: "Thompson",
//       title: "Residential Sales Expert",
//       avatar: "https://randomuser.me/api/portraits/women/63.jpg",
//       rating: 4.9,
//       reviewCount: 156,
//       totalSales: 3200000,
//       propertiesSold: 67,
//       activeListings: 15,
//       yearsExperience: 10,
//       location: "Suburban Areas",
//       phone: "+1 (555) 345-6789",
//       email: "emily.thompson@abode.com",
//       specialties: ["Family Homes", "First-Time Buyers", "Relocation Services"],
//       languages: ["English", "French"],
//       certifications: ["ABR", "GRI", "SRS"],
//       bio: "Emily has been helping families find their perfect homes for over a decade. She specializes in residential sales and relocation services.",
//       achievements: ["Top Producer 2023", "Family Choice Award", "Excellence in Service"],
//       responseTime: "< 30 minutes",
//       commission: "2.5%",
//       available: true
//     },
//     {
//       id: 4,
//       firstName: "Michael",
//       lastName: "Chen",
//       title: "Commercial Real Estate Agent",
//       avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//       rating: 4.7,
//       reviewCount: 74,
//       totalSales: 5600000,
//       propertiesSold: 28,
//       activeListings: 6,
//       yearsExperience: 12,
//       location: "Financial District",
//       phone: "+1 (555) 456-7890",
//       email: "michael.chen@abode.com",
//       specialties: ["Commercial Properties", "Office Buildings", "Retail Spaces"],
//       languages: ["English", "Mandarin"],
//       certifications: ["CCIM", "SIOR"],
//       bio: "Michael is a commercial real estate expert with extensive experience in office buildings and retail spaces in the financial district.",
//       achievements: ["Commercial Expert 2023", "Deal of the Year Award"],
//       responseTime: "< 1 hour",
//       commission: "3.0%",
//       available: false
//     },
//     {
//       id: 5,
//       firstName: "Jessica",
//       lastName: "Williams",
//       title: "Luxury Home Specialist",
//       avatar: "https://randomuser.me/api/portraits/women/28.jpg",
//       rating: 4.8,
//       reviewCount: 93,
//       totalSales: 4100000,
//       propertiesSold: 38,
//       activeListings: 9,
//       yearsExperience: 7,
//       location: "Upscale Neighborhoods",
//       phone: "+1 (555) 567-8901",
//       email: "jessica.williams@abode.com",
//       specialties: ["Luxury Homes", "Waterfront Properties", "Estate Sales"],
//       languages: ["English"],
//       certifications: ["CLHMS", "CRS"],
//       bio: "Jessica specializes in luxury and waterfront properties, providing exceptional service to high-end clients seeking premium real estate.",
//       achievements: ["Luxury Agent 2023", "Waterfront Specialist Award"],
//       responseTime: "< 45 minutes",
//       commission: "2.8%",
//       available: true
//     },
//     {
//       id: 6,
//       firstName: "Robert",
//       lastName: "Davis",
//       title: "New Construction Specialist",
//       avatar: "https://randomuser.me/api/portraits/men/55.jpg",
//       rating: 4.6,
//       reviewCount: 61,
//       totalSales: 2800000,
//       propertiesSold: 34,
//       activeListings: 11,
//       yearsExperience: 9,
//       location: "Development Areas",
//       phone: "+1 (555) 678-9012",
//       email: "robert.davis@abode.com",
//       specialties: ["New Construction", "Custom Homes", "Builder Relations"],
//       languages: ["English"],
//       certifications: ["New Home Sales"],
//       bio: "Robert works exclusively with new construction and custom homes, maintaining strong relationships with local builders and developers.",
//       achievements: ["New Home Expert 2023", "Builder Partnership Award"],
//       responseTime: "< 3 hours",
//       commission: "2.5%",
//       available: true
//     }
//   ];

//   const filteredAgents = agents.filter(agent => {
//     const matchesSearch = 
//       agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       agent.specialties.some(specialty => 
//         specialty.toLowerCase().includes(searchTerm.toLowerCase())
//       ) ||
//       agent.location.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesFilter = 
//       filterBy === "all" ||
//       (filterBy === "available" && agent.available) ||
//       (filterBy === "luxury" && agent.specialties.includes("Luxury Homes")) ||
//       (filterBy === "commercial" && agent.specialties.includes("Commercial Properties")) ||
//       (filterBy === "investment" && agent.specialties.includes("Investment Properties"));
    
//     return matchesSearch && matchesFilter;
//   });

//   const sortedAgents = [...filteredAgents].sort((a, b) => {
//     switch (sortBy) {
//       case "rating":
//         return b.rating - a.rating;
//       case "experience":
//         return b.yearsExperience - a.yearsExperience;
//       case "sales":
//         return b.totalSales - a.totalSales;
//       case "name":
//         return a.firstName.localeCompare(b.firstName);
//       default:
//         return 0;
//     }
//   });

//   const AgentCard = ({ agent }: { agent: typeof agents[0] }) => (
//     <Card className="h-full hover:shadow-lg transition-shadow duration-300">
//       <CardHeader className="pb-4">
//         <div className="flex items-start gap-4">
//           <div className="relative">
//             <Avatar className="h-16 w-16">
//               <AvatarImage src={agent.avatar} alt={`${agent.firstName} ${agent.lastName}`} />
//               <AvatarFallback>{agent.firstName[0]}{agent.lastName[0]}</AvatarFallback>
//             </Avatar>
//             <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
//               agent.available ? 'bg-green-500' : 'bg-gray-400'
//             }`} />
//           </div>
//           <div className="flex-1">
//             <div className="flex items-start justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold text-navy-900">
//                   {agent.firstName} {agent.lastName}
//                 </h3>
//                 <p className="text-sm text-navy-600">{agent.title}</p>
//               </div>
//               <Badge variant={agent.available ? "default" : "secondary"}>
//                 {agent.available ? "Available" : "Busy"}
//               </Badge>
//             </div>
//             <div className="flex items-center gap-1 mt-2">
//               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//               <span className="text-sm font-medium">{agent.rating}</span>
//               <span className="text-sm text-gray-500">({agent.reviewCount} reviews)</span>
//             </div>
//           </div>
//         </div>
//       </CardHeader>
      
//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div className="flex items-center gap-2">
//             <MapPin className="h-4 w-4 text-gray-500" />
//             <span className="text-navy-700">{agent.location}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Award className="h-4 w-4 text-gray-500" />
//             <span className="text-navy-700">{agent.yearsExperience} years</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Home className="h-4 w-4 text-gray-500" />
//             <span className="text-navy-700">{agent.propertiesSold} sold</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <DollarSign className="h-4 w-4 text-gray-500" />
//             <span className="text-navy-700">${(agent.totalSales / 1000000).toFixed(1)}M sales</span>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <p className="text-sm font-medium text-navy-800">Specialties</p>
//           <div className="flex flex-wrap gap-1">
//             {agent.specialties.slice(0, 3).map((specialty, index) => (
//               <Badge key={index} variant="outline" className="text-xs">
//                 {specialty}
//               </Badge>
//             ))}
//           </div>
//         </div>

//         <div className="space-y-2">
//           <p className="text-sm font-medium text-navy-800">Contact</p>
//           <div className="space-y-1">
//             <div className="flex items-center gap-2 text-sm">
//               <Phone className="h-3 w-3 text-gray-500" />
//               <span className="text-navy-700">{agent.phone}</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm">
//               <Mail className="h-3 w-3 text-gray-500" />
//               <span className="text-navy-700">{agent.email}</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-2 pt-2">
//           <Button className="flex-1" size="sm">
//             Contact Agent
//           </Button>
//           <Button variant="outline" size="sm">
//             View Profile
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   const AgentListItem = ({ agent }: { agent: typeof agents[0] }) => (
//     <Card className="hover:shadow-md transition-shadow duration-300">
//       <CardContent className="p-4">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Avatar className="h-12 w-12">
//               <AvatarImage src={agent.avatar} alt={`${agent.firstName} ${agent.lastName}`} />
//               <AvatarFallback>{agent.firstName[0]}{agent.lastName[0]}</AvatarFallback>
//             </Avatar>
//             <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//               agent.available ? 'bg-green-500' : 'bg-gray-400'
//             }`} />
//           </div>
          
//           <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <h3 className="font-semibold text-navy-900">
//                 {agent.firstName} {agent.lastName}
//               </h3>
//               <p className="text-sm text-navy-600">{agent.title}</p>
//               <div className="flex items-center gap-1 mt-1">
//                 <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                 <span className="text-xs">{agent.rating} ({agent.reviewCount})</span>
//               </div>
//             </div>
            
//             <div className="text-sm">
//               <p className="flex items-center gap-1 mb-1">
//                 <MapPin className="h-3 w-3" />
//                 {agent.location}
//               </p>
//               <p className="flex items-center gap-1">
//                 <Award className="h-3 w-3" />
//                 {agent.yearsExperience} years exp.
//               </p>
//             </div>
            
//             <div className="text-sm">
//               <p className="flex items-center gap-1 mb-1">
//                 <Home className="h-3 w-3" />
//                 {agent.propertiesSold} properties sold
//               </p>
//               <p className="flex items-center gap-1">
//                 <DollarSign className="h-3 w-3" />
//                 ${(agent.totalSales / 1000000).toFixed(1)}M in sales
//               </p>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <Badge variant={agent.available ? "default" : "secondary"} className="text-xs">
//                 {agent.available ? "Available" : "Busy"}
//               </Badge>
//               <Button size="sm" className="ml-auto">
//                 Contact
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
      
//       <main className="flex-1 mt-16">
//         {/* Header */}
//         <section className="bg-gradient-to-r from-[#102A43] to-[#243B53] text-white py-12">
//           <div className="container mx-auto px-4">
//             <div className="max-w-3xl">
//               <h1 className="text-4xl md:text-5xl font-bold mb-4">
//                 Meet Our Expert Agents
//               </h1>
//               <p className="text-xl text-white/90 mb-8">
//                 Connect with experienced real estate professionals who will guide you through every step of your property journey.
//               </p>
              
//               {/* Quick Stats */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-real-300">{agents.length}</div>
//                   <div className="text-sm text-white/80">Expert Agents</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-real-300">
//                     {agents.reduce((sum, agent) => sum + agent.propertiesSold, 0)}
//                   </div>
//                   <div className="text-sm text-white/80">Properties Sold</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-real-300">
//                     ${(agents.reduce((sum, agent) => sum + agent.totalSales, 0) / 1000000).toFixed(0)}M
//                   </div>
//                   <div className="text-sm text-white/80">Total Sales</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-real-300">
//                     {(agents.reduce((sum, agent) => sum + agent.rating, 0) / agents.length).toFixed(1)}
//                   </div>
//                   <div className="text-sm text-white/80">Avg Rating</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Search and Filters */}
//         <section className="py-8 bg-gray-50">
//           <div className="container mx-auto px-4">
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex flex-col md:flex-row gap-4">
//                   <div className="flex-1 relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       placeholder="Search agents by name, specialty, or location..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10"
//                     />
//                   </div>
                  
//                   <div className="flex gap-4">
//                     <Select value={filterBy} onValueChange={setFilterBy}>
//                       <SelectTrigger className="w-40">
//                         <Filter className="h-4 w-4 mr-2" />
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Agents</SelectItem>
//                         <SelectItem value="available">Available</SelectItem>
//                         <SelectItem value="luxury">Luxury Specialists</SelectItem>
//                         <SelectItem value="commercial">Commercial</SelectItem>
//                         <SelectItem value="investment">Investment</SelectItem>
//                       </SelectContent>
//                     </Select>
                    
//                     <Select value={sortBy} onValueChange={setSortBy}>
//                       <SelectTrigger className="w-40">
//                         <TrendingUp className="h-4 w-4 mr-2" />
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="rating">Top Rated</SelectItem>
//                         <SelectItem value="experience">Most Experienced</SelectItem>
//                         <SelectItem value="sales">Highest Sales</SelectItem>
//                         <SelectItem value="name">Name A-Z</SelectItem>
//                       </SelectContent>
//                     </Select>
                    
//                     <div className="flex rounded-lg border">
//                       <Button
//                         variant={viewMode === "grid" ? "default" : "ghost"}
//                         size="sm"
//                         onClick={() => setViewMode("grid")}
//                         className="rounded-r-none"
//                       >
//                         <Grid className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant={viewMode === "list" ? "default" : "ghost"}
//                         size="sm"
//                         onClick={() => setViewMode("list")}
//                         className="rounded-l-none"
//                       >
//                         <List className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center justify-between mt-4">
//                   <p className="text-sm text-gray-600">
//                     Showing {sortedAgents.length} of {agents.length} agents
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     {agents.filter(a => a.available).length} agents available now
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </section>

//         {/* Agents List */}
//         <section className="py-8">
//           <div className="container mx-auto px-4">
//             {viewMode === "grid" ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {sortedAgents.map((agent) => (
//                   <AgentCard key={agent.id} agent={agent} />
//                 ))}
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {sortedAgents.map((agent) => (
//                   <AgentListItem key={agent.id} agent={agent} />
//                 ))}
//               </div>
//             )}
            
//             {sortedAgents.length === 0 && (
//               <div className="text-center py-12">
//                 <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-600 mb-2">No agents found</h3>
//                 <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
//               </div>
//             )}
//           </div>
//         </section>
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default Agents;

import React, { useState } from "react";
import { Users } from "lucide-react";
import Navbar from "../Home/Nav";
import AgentFilters from "./filters";
import AgentCard from "./Agent-Card";
import AgentListItem from "./listitem";
import Footer from "../Home/Footer";

const Agents = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");

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
      languages: ["English", "Spanish"],
      certifications: ["CRS", "GRI", "ABR"],
      bio: "Sarah is a dedicated real estate professional with over 8 years of experience in luxury and commercial properties. She has helped hundreds of clients find their dream homes.",
      achievements: ["Top Agent 2023", "Million Dollar Club", "Client Choice Award"],
      responseTime: "< 1 hour",
      commission: "2.5%",
      available: true
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
      languages: ["English", "Portuguese"],
      certifications: ["CCIM", "CRS"],
      bio: "David specializes in investment properties and helps clients build their real estate portfolios with strategic market analysis and expert guidance.",
      achievements: ["Rising Star 2023", "Investment Expert Award"],
      responseTime: "< 2 hours",
      commission: "2.75%",
      available: true
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
      languages: ["English", "French"],
      certifications: ["ABR", "GRI", "SRS"],
      bio: "Emily has been helping families find their perfect homes for over a decade. She specializes in residential sales and relocation services.",
      achievements: ["Top Producer 2023", "Family Choice Award", "Excellence in Service"],
      responseTime: "< 30 minutes",
      commission: "2.5%",
      available: true
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
      languages: ["English", "Mandarin"],
      certifications: ["CCIM", "SIOR"],
      bio: "Michael is a commercial real estate expert with extensive experience in office buildings and retail spaces in the financial district.",
      achievements: ["Commercial Expert 2023", "Deal of the Year Award"],
      responseTime: "< 1 hour",
      commission: "3.0%",
      available: false
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
      languages: ["English"],
      certifications: ["CLHMS", "CRS"],
      bio: "Jessica specializes in luxury and waterfront properties, providing exceptional service to high-end clients seeking premium real estate.",
      achievements: ["Luxury Agent 2023", "Waterfront Specialist Award"],
      responseTime: "< 45 minutes",
      commission: "2.8%",
      available: true
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
      languages: ["English"],
      certifications: ["New Home Sales"],
      bio: "Robert works exclusively with new construction and custom homes, maintaining strong relationships with local builders and developers.",
      achievements: ["New Home Expert 2023", "Builder Partnership Award"],
      responseTime: "< 3 hours",
      commission: "2.5%",
      available: true
    }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterBy === "all" ||
      (filterBy === "available" && agent.available) ||
      (filterBy === "luxury" && agent.specialties.includes("Luxury Homes")) ||
      (filterBy === "commercial" && agent.specialties.includes("Commercial Properties")) ||
      (filterBy === "investment" && agent.specialties.includes("Investment Properties"));
    
    return matchesSearch && matchesFilter;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "experience":
        return b.yearsExperience - a.yearsExperience;
      case "sales":
        return b.totalSales - a.totalSales;
      case "name":
        return a.firstName.localeCompare(b.firstName);
      default:
        return 0;
    }
  });

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
                  <div className="text-3xl font-bold text-white">{agents.length}</div>
                  <div className="text-sm text-white/80">Expert Agents</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">
                    {agents.reduce((sum, agent) => sum + agent.propertiesSold, 0)}
                  </div>
                  <div className="text-sm text-white/80">Properties Sold</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">
                    ${(agents.reduce((sum, agent) => sum + agent.totalSales, 0) / 1000000).toFixed(0)}M
                  </div>
                  <div className="text-sm text-white/80">Total Sales</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">
                    {(agents.reduce((sum, agent) => sum + agent.rating, 0) / agents.length).toFixed(1)}
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
          totalAgents={agents.length}
          filteredCount={sortedAgents.length}
          availableCount={agents.filter(a => a.available).length}
        />

        {/* Agents Grid/List */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-w-6xl mx-auto">
                {sortedAgents.map((agent) => (
                  <AgentListItem key={agent.id} agent={agent} />
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