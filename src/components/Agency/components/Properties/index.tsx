'use client';

import React, { useState } from "react";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Zap, 
  Filter,
  SortAsc,
  SortDesc,
  Upload
} from "lucide-react";
import Navbar from "@/components/pages/Home/Nav";
import AgentPropertyView from "./view-property";
import PropertyUploadForm from "./dialogs/upload-property";
import PropertyEditForm from "./dialogs/edit-property";
import { agentDashboardData } from "../..";

const AgentPropertiesManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;
  const [viewAgentProperty, setViewAgentProperty] = useState<boolean>(false);
  const [uploadProperty, setUploadProperty] = useState<boolean>(false);
  const [editProperty, setEditProperty] = useState<boolean>(false);
  // Mock properties data
  const allProperties = [
    {
      id: 1,
      title: "Modern Downtown Condo",
      address: "123 Oak Street",
      price: 485000,
      type: "Condo",
      status: "Active",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      daysOnMarket: 12,
      views: 245,
      isBoosted: true,
      image: "/placeholder.svg",
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      title: "Family House with Garden",
      address: "456 Maple Avenue",
      price: 675000,
      type: "Single Family",
      status: "Pending",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
      daysOnMarket: 8,
      views: 189,
      isBoosted: false,
      image: "/placeholder.svg",
      dateAdded: "2024-01-20"
    },
    {
      id: 3,
      title: "Luxury Townhouse",
      address: "789 Pine Road",
      price: 825000,
      type: "Townhouse",
      status: "Sold",
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1850,
      daysOnMarket: 25,
      views: 167,
      isBoosted: true,
      image: "/placeholder.svg",
      dateAdded: "2024-01-05"
    },
    {
      id: 4,
      title: "Cozy Studio Apartment",
      address: "321 Elm Street",
      price: 285000,
      type: "Condo",
      status: "Active",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      daysOnMarket: 5,
      views: 98,
      isBoosted: false,
      image: "/placeholder.svg",
      dateAdded: "2024-01-25"
    },
    {
      id: 5,
      title: "Spacious Ranch Home",
      address: "654 Birch Lane",
      price: 550000,
      type: "Single Family",
      status: "Active",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      daysOnMarket: 18,
      views: 134,
      isBoosted: false,
      image: "/placeholder.svg",
      dateAdded: "2024-01-10"
    },
    {
      id: 6,
      title: "Urban Loft",
      address: "987 Cedar Court",
      price: 425000,
      type: "Condo",
      status: "Active",
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1100,
      daysOnMarket: 22,
      views: 156,
      isBoosted: true,
      image: "/placeholder.svg",
      dateAdded: "2024-01-08"
    },
    {
      id: 7,
      title: "Suburban Villa",
      address: "159 Willow Way",
      price: 750000,
      type: "Single Family",
      status: "Pending",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      daysOnMarket: 15,
      views: 201,
      isBoosted: false,
      image: "/placeholder.svg",
      dateAdded: "2024-01-18"
    }
  ];

  // Filter and sort properties
  const filteredAndSortedProperties = allProperties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || property.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "date":
          aValue = new Date(a.dateAdded).getTime();
          bValue = new Date(b.dateAdded).getTime();
          break;
        case "views":
          aValue = a.views;
          bValue = b.views;
          break;
        default:
          aValue = a.daysOnMarket;
          bValue = b.daysOnMarket;
      }
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = filteredAndSortedProperties.slice(startIndex, startIndex + propertiesPerPage);

  const getStatusBadge = (status: string) => {
    const variants = {
      "Active": "default",
      "Pending": "secondary",
      "Sold": "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"} className={`${status === "Active" && "bg-green-200 text-green 500"}`}>{status}</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
        <Navbar data={agentDashboardData}/>
        <div className="container mx-auto space-y-6 p-6 mt-16">
        
        {/* Header with Add Property Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
            <h2 className="text-2xl font-semibold">My Properties</h2>
            <p className="text-muted-foreground">Manage and track your property listings</p>
            </div>
            <div className="flex gap-2">
            <Button variant="outline" onClick={() => setUploadProperty(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Property
            </Button>
            {/* <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
            </Button> */}
            </div>
        </div>

        {/* Search and Filters */}
        <Card>
            <CardContent className="px-4 ">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                    placeholder="Search properties by title, address, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    />
                </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="date">Date Added</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                    <SelectItem value="daysOnMarket">Days on Market</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
                </div>
            </div>
            </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden pt-0">
                <div className="relative">
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                    // width={0}
                    // height={0}
                />
                {property.isBoosted && (
                    <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Zap className="h-3 w-3 mr-1" />
                        Boosted
                    </Badge>
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    {getStatusBadge(property.status)}
                </div>
                </div>
                
                <CardContent className="p-4">
                <div className="space-y-3">
                    <div>
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.address}</p>
                    <p className="text-xl font-bold text-primary">{formatPrice(property.price)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                    <span>{property.sqft} sqft</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{property.views} views</span>
                    <span className="text-muted-foreground">{property.daysOnMarket} days on market</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setViewAgentProperty(true)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditProperty(true)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                        </Button>
                    </div>
                    
                    {!property.isBoosted && (
                        <Button size="sm" variant="secondary">
                        <Zap className="h-4 w-4 mr-1" />
                        Boost
                        </Button>
                    )}
                    </div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex justify-center">
            <Pagination>
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                    >
                        {page}
                    </PaginationLink>
                    </PaginationItem>
                ))}
                
                <PaginationItem>
                    <PaginationNext 
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                </PaginationContent>
            </Pagination>
            </div>
        )}

        {/* No Results */}
        {filteredAndSortedProperties.length === 0 && (
            <Card>
            <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No properties found matching your criteria.</p>
            </CardContent>
            </Card>
        )}
        </div>
        <AgentPropertyView isOpen={viewAgentProperty} onClose={() => setViewAgentProperty(false)} onBoost={() => {}} property={allProperties[0]}/>
        <PropertyUploadForm isOpen={uploadProperty} onClose={() => setUploadProperty(false)} onSubmit={() => {}}/>
        <PropertyEditForm property={allProperties[1]} isOpen={editProperty} onClose={() => setEditProperty(false)} onSave={() => {}} />
    </>
  );
};

export default AgentPropertiesManager;