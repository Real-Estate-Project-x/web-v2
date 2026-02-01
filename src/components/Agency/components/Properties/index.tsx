"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Edit,
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  Upload,
  Zap,
} from "lucide-react";
import PropertyEditForm from "./dialogs/edit-property";
import { axiosInstance } from "@/lib/axios-interceptor";
import { AgentDatabaseInterface, PaginationControlInterface } from "../../../../../utils/interfaces";
import {
  convertDateCreatedToGetNumberOfDays,
  formatPrice,
  getLocalStorageFieldRaw,
} from "../../../../../utils/helpers";
import PropertyListingDialog from "./dialogs/new-upload";
import { useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-select";
import { BoostPropertyPrompt } from "./agent-property-view";
import { toast } from "sonner";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";

const AgentPropertiesManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("NEWEST");
  //const [currentPage, setCurrentPage] = useState(1);
  const [isBoosted, setIsBoosted] = useState(false);
  //const propertiesPerPage = 6;
  const [uploadProperty, setUploadProperty] = useState<boolean>(false);
  const [editProperty, setEditProperty] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [property, setProperty] = useState<AgentDatabaseInterface>({} as AgentDatabaseInterface);
  const [properties, setProperties] = useState<AgentDatabaseInterface[]>([] as AgentDatabaseInterface[]);
  const router = useRouter();
  const [reload, setReload] = useState<boolean>(false);
  const agencyId = getLocalStorageFieldRaw('agentId');
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );

  useEffect(() => {

    const boostPaymentReference = localStorage.getItem("boost_payment_reference");
    if(boostPaymentReference){
      // verify payment status from backend
      axiosInstance.get(`/payment/boost/verify/${boostPaymentReference}`)
      .then((response) => {
        if(response?.data?.success){
          toast.success("Property Boosted!",{description : "Your property will now appear higher in search results."});
          localStorage.removeItem("boost_payment_reference");
          setIsBoosted(true);
        }
      }).catch((err) => {
        console.log({err});
      });
    }

  },[]);

  const fetchAgentProperties = async (pageNumber = 1, pageSize = 10) =>{
    axiosInstance.get(`/agency/${agencyId}/properties?sortBy=${statusFilter}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
    .then((response) => {
     setProperties(response.data.data);
     setPagination(response?.data?.paginationControl);
    }).catch((err) => {
      console.log({err});
    });
  }

  const loadData = async (page : number) => {
    await fetchAgentProperties(page);
  }

  useEffect(() => {

    if(!agencyId) return;
    loadData(1);

  },[isBoosted, agencyId, reload, statusFilter]);


  const filteredAndSortedProperties = () : AgentDatabaseInterface[] => {
    if(properties.length === 0){
      return [];
    }
     return properties.filter(property => {
      const matchesSearch =
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.propertyType?.tag?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    }).sort((a, b) => {
      let aValue, bValue;
      switch (statusFilter.toLowerCase()) {
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
    
  }
  
  const hasNoRecords = Array.isArray(filteredAndSortedProperties) && filteredAndSortedProperties?.length === 0;

  // Pagination
  // const totalPages = Math.ceil(
  //   filteredAndSortedProperties.length / propertiesPerPage
  // );
  // const startIndex = (currentPage - 1) * propertiesPerPage;
  // const currentProperties = filteredAndSortedProperties()?.slice(
  //   startIndex,
  //   startIndex + propertiesPerPage
  // );

  const getStatusBadge = (status: string) => {
    const variants = {
      Rent: "default",
      Sale: "secondary",
      Sold: "outline",
    } as const;

    return (
      <Badge
        variant={variants[status as keyof typeof variants]}
        className={`py-1 font-normal rounded-lg text-white font-medium ${
          status && "bg-black "
        }`}
      >
        {status ? "Active" : "Sold"}
      </Badge>
    );
  };

  return (
    <>
      <div className="w-full mx-auto space-y-6 p-6">
        {/* Header with Add Property Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold">My Properties</h2>
            <p className="text-muted-foreground">
              Manage and track your property listings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setUploadProperty(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Property
            </Button>
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
                    <SelectItem value="NEWEST">Newest</SelectItem>
                    <SelectItem value="ALPHABETICAL_ORDER">A-Z</SelectItem>
                    <SelectItem value="OLDEST">Oldest</SelectItem>
                    {/* <SelectItem value="pending">Pending</SelectItem> */}
                    <SelectItem value="PRICE">Price</SelectItem>
                  </SelectContent>
                </Select>

                {/* <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Added</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="daysOnMarket">Days on Market</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProperties && filteredAndSortedProperties()?.map((property, index) => (
            <Card key={property.id} className="overflow-hidden pt-0 pb-4">
              <div className="relative">
                <img
                  src={property?.propertyImages?.[0]?.image?.url}
                  alt={property.title}
                  className="w-full h-56 object-cover"
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
                  {getStatusBadge(property.upFor)}
                </div>
              </div>

              <CardContent className="pb-4 px-4 pt-0">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {property.title}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {property.address}
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(property.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {property.noOfBedrooms} bed • {property.noOfToilets} bath
                    </span>
                    <span>{property.sizeInSquareFeet} sqft</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {convertDateCreatedToGetNumberOfDays(
                        property.dateCreated
                      )}{" "}
                      days on market
                    </span>
                  </div>

                  <Separator className="w-full " />
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/agent-dashboard/properties/view?id=${property.slug}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {/* View */}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setProperty(property);
                        setIndex(index);
                        setEditProperty(true);
                      }}>
                        <Edit className="h-4 w-4 mr-1" />
                        {/* Edit */}
                      </Button>
                    </div>
                      <Button size="sm" className="bg-green-800 text-white disabled:bg-gray-400"
                      disabled={property?.isBoosted}
                      onClick={() => {
                        setProperty(property);
                        setIsBoosted(true);
                      }}>
                        <Zap className="h-4 w-4 mr-1" />
                        Boost
                      </Button>
                    </div>
                  </div>
                </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {/* {totalPages > 1 && (
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
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )} */}
        {pagination?.currentPage  &&
          <DynamicPagination
            currentPage={pagination?.currentPage}
            totalPages={pagination?.totalPages}
            hasNext={pagination?.hasNext}
            hasPrevious={pagination?.hasPrevious}
            onPageChange={loadData} 
          />
        }

        {/* No Results */}
        {hasNoRecords && (
          <Card >
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No properties found matching your criteria.
              </p>
            </CardContent>
          </Card>
        )}
        </div>

        <PropertyListingDialog open={uploadProperty} onOpenChange={() => {setUploadProperty(false); setReload(!reload);}}/>
        <PropertyEditForm 
          property={property} 
          isOpen={editProperty} 
          index={index+1}
          onClose={() => setEditProperty(false)} 
          onSave={() => setReload(!reload)} 
        />
        <BoostPropertyPrompt 
          isOpen={isBoosted} 
          onClose={() => setIsBoosted(false)} 
          id={property?.id}
          setBoost={() => setIsBoosted(true)}
        />
    </>
  );
};


export default AgentPropertiesManager;
