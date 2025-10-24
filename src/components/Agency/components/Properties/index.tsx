'use client';

import React, { useEffect, useState } from "react";
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
import AgentPropertyView from "./view-property";
import PropertyUploadForm from "./dialogs/upload-property";
import PropertyEditForm from "./dialogs/edit-property";
import { agentDashboardData } from "../..";
import { axiosInstance } from "@/lib/axios-interceptor";
import { AgentDatabaseInterface } from "../../../../../utils/interfaces";
import { convertDateCreatedToGetNumberOfDays, formatPrice } from "../../../../../utils/helpers";
import PropertyListingDialog from "./dialogs/new-upload";

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
  const [property, setProperty] = useState<AgentDatabaseInterface>({} as AgentDatabaseInterface);
  const [properties, setProperties] = useState<AgentDatabaseInterface[]>([] as AgentDatabaseInterface[]);

  useEffect(() => {
    axiosInstance.get(`/property/agency-property-list/${agencyId}`)
    .then((response) => {
      setProperties(response.data.data);
    }).catch((err) => {
      console.log({err});
    });
  },[]);

  
  const filteredAndSortedProperties = properties.filter(property => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.propertyType?.tag?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (property.status && statusFilter.toLowerCase() === "active") ||
      (!property.status && statusFilter.toLowerCase() === "sold");

    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "date":
        aValue = new Date(a.dateCreated).getTime();
        bValue = new Date(b.dateCreated).getTime();
        break;
      default:
        aValue = convertDateCreatedToGetNumberOfDays(a.dateCreated);
        bValue = convertDateCreatedToGetNumberOfDays(b.dateCreated);
    }
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = filteredAndSortedProperties.slice(startIndex, startIndex + propertiesPerPage);

  const agencyId = "8b6c7c37-72b5-4db8-9184-214f32b8b68d";

  const getStatusBadge = (status: string) => {
    const variants = {
      "Rent": "default",
      "Sale": "secondary",
      "Sold": "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"} className={`p-2 font-normal rounded-full ${status && "bg-green-200 text-green 500"}`}>{status ? "Active" : "Sold"}</Badge>;
  };

  return (
    <>
        <div className="w-full mx-auto space-y-6 p-6">
        
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
                    {/* <SelectItem value="pending">Pending</SelectItem> */}
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
                    {/* <SelectItem value="views">Views</SelectItem> */}
                    <SelectItem value="daysOnMarket">Days on Market</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
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
                    src={property.photoUrls[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                    // width={0}
                    // height={0}
                />
                {/* {property.isBoosted && (
                    <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Zap className="h-3 w-3 mr-1" />
                        Boosted
                    </Badge>
                    </div>
                )} */}
                <div className="absolute top-2 left-2">
                    {getStatusBadge(property.upFor)}
                </div>
                </div>
                
                <CardContent className="p-4">
                <div className="space-y-3">
                    <div>
                    <h3 className="font-semibold text-lg capitalize">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.address}</p>
                    <p className="text-xl font-bold text-primary">{formatPrice(property.price)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{property.noOfBedrooms} bed • {property.noOfToilets} bath</span>
                    <span>{property.sizeInSquareFeet} sqft</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                    {/* <span className="text-muted-foreground">{property.views} views</span> */}
                    <span className="text-muted-foreground">{convertDateCreatedToGetNumberOfDays(property.dateCreated)} days on market</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setProperty(property);
                          setViewAgentProperty(true);
                        }}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setProperty(property);
                          setEditProperty(true);
                        }}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                    </div>
                    
                    {/* {!property.isBoosted && (
                        <Button size="sm" variant="secondary">
                        <Zap className="h-4 w-4 mr-1" />
                        Boost
                        </Button>
                    )} */}
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
        <AgentPropertyView isOpen={viewAgentProperty} onClose={() => setViewAgentProperty(false)} onBoost={() => {}} property={property}/>
        {/* <PropertyUploadForm isOpen={uploadProperty} onClose={() => setUploadProperty(false)} onSubmit={() => {}}/> */}
        <PropertyListingDialog open={uploadProperty} onOpenChange={() => setUploadProperty(false)}/>
        {/* <PropertyEditForm property={property} isOpen={editProperty} onClose={() => setEditProperty(false)} onSave={() => {}} /> */}
    </>
  );
};

export default AgentPropertiesManager;