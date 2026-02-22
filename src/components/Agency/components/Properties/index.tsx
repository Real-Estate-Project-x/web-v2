"use client";

import { toast } from "sonner";
import { AxiosError } from "axios";
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
import { Search, Edit, Eye, Upload, Zap, SortAsc, SortDesc, BarChart3, MapPin, Building, Building2, CircleCheck } from "lucide-react";
import PropertyEditForm from "./dialogs/edit-property";
import { axiosInstance } from "@/lib/axios-interceptor";
import {
  AgentDatabaseInterface,
  PaginationControlInterface,
} from "../../../../../utils/interfaces";
import {
  convertDateCreatedToGetNumberOfDays,
  deleteLocalStorageField,
  formatPrice,
  getLocalStorageFieldRaw,
} from "../../../../../utils/helpers";
import PropertyListingDialog from "./dialogs/new-upload";
import { useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-select";
import { BoostPropertyPrompt } from "./agent-property-view";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";

const AgentPropertiesManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("NEWEST");
  const [isBoosted, setIsBoosted] = useState(false);
  const [uploadProperty, setUploadProperty] = useState<boolean>(false);
  const [editProperty, setEditProperty] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [property, setProperty] = useState<AgentDatabaseInterface>(
    {} as AgentDatabaseInterface
  );
  const [properties, setProperties] = useState<AgentDatabaseInterface[]>(
    [] as AgentDatabaseInterface[]
  );
  const router = useRouter();
  const [reload, setReload] = useState<boolean>(false);
  const agencyId = getLocalStorageFieldRaw("agentId");
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  const [stateId, setStateId] = useState("");
  const [propertyTypeId, setPropertyTypeId] = useState("");
  const [upFor, setUpFor] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sortBy, setSortBy] = useState("VIEWS");
  const [sortOrder, setSortOrder] = useState("DESC");

  const verifyBoost = async (reference: string) => {
    const url = `/payment/boost/verify/${reference}`;

    try {
      const response = await axiosInstance.get(url);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchStates = async () => {
    const url = `/country/states/by-country`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchPropertyTypes = async () => {
    const url = "/property-type";
    try {
      const response = await axiosInstance.get(url);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchAgentProperties = async (
    pageNumber = 1,
    pageSize = 10,
    queryParams = {}
  ) => {
    const url = `/property/agency-property-list/${agencyId}/`;
    try {
      const response = await axiosInstance.get(url, {
        params: { ...queryParams, pageNumber, pageSize },
      });
      if (response.data?.success) {
        const {
          data: { data, paginationControl },
        } = response;
        setProperties(data);
        setPagination(paginationControl);
      }
    } catch (error) {
      let message = "An error occurred";
      if (error instanceof AxiosError) {
        message = error.message;
      }
      toast(message, { description: JSON.stringify(error) });
      throw error;
    }
  };

  const loadData = async (page: number) => {
    await fetchAgentProperties(page);
  };

  useEffect(() => {
    loadData(1);

    const key = "boost_payment_reference";
    const boostPaymentReference = localStorage.getItem(key);
    if (boostPaymentReference) {
      // verify payment status from backend
      verifyBoost(boostPaymentReference)
        .then((response) => {
          const message = response.message ?? "Property boosted successfully";
          toast.success(message, {
            description:
              "Your property will now appear higher in search results.",
          });
          setIsBoosted(true);
          deleteLocalStorageField(key);
        })
        .catch((err) => {
          console.log({ err });
        });
    }
    // Fetch states record
    fetchStates()
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        throw error;
      });

    // Fetch property_type records
    fetchPropertyTypes()
      .then((response) => {
        setPropertyTypes(response.data);
      })
      .catch((error) => {
        throw error;
      });
  }, [isBoosted, agencyId, reload, statusFilter]);

  const handleSearch = async () => {
    const queryParams = {
      pageNumber: 1,
      pageSize: 10,
      ...(searchTerm && { searchTerm }),
      ...(stateId && { stateId }),
      ...(propertyTypeId && { propertyTypeId }),
      ...(upFor && { upFor }),
      ...(isActive !== "" && { isActive: isActive === "true" }),
      ...(typeof isBoosted === "boolean" && { isBoosted }),
      ...(sortBy && sortOrder && { sortBy, sortOrder }),
    };

    await fetchAgentProperties(1, 10, queryParams);
  };

  const hasNoRecords = Array.isArray(properties) && properties.length <= 0;

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
            <h2 className="text-2xl font-semibold">Agency Properties</h2>
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
          <CardContent className="px-6 pb-4 pt-2 lg:py-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div className="space-y-4">
                {/* 🔍 Row 1: Search + Sorting */}
                <p className="text-lg font-medium text-gray-500 text-sm text-center tracking-[0.3em] uppercase inline lg:hidden">Search Filters</p>
                <br/>
                <br/>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Search */}
                  <div className="relative lg:col-span-5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-6"
                    />
                  </div>
                  <section className="grid grid-cols-2 gap-1">
                    {/* Sort By */}
                    <div className="lg:col-span-3">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
                          <BarChart3/>
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRICE">Price</SelectItem>
                          <SelectItem value="VIEWS">Views</SelectItem>
                          <SelectItem value="DAYS_ON_MARKET">
                            Days On Market
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Order */}
                    <div className="col-span-1 lg:col-span-2">
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-full">
                          <SortDesc/>
                          <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DESC">Desc</SelectItem>
                          <SelectItem value="ASC">Asc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </section>
                  {/* Submit Button */}
                  <div className="lg:col-span-2">
                    <Button type="submit" className="w-full">
                      Search
                    </Button>
                  </div>
                </div>

                {/* 🏠 Row 2: Filters */}
                {/* <section className="w-full"> */}
                <p className="text-lg font-medium text-gray-500 text-sm text-center tracking-[0.3em] py-4 uppercase inline lg:hidden">Extra Filters</p>
                <br/>
                <br/>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {/* State */}
                  <Select value={stateId} onValueChange={setStateId}>
                    <SelectTrigger className="w-full">
                      <MapPin/>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id}>
                          {String(state.name).toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Property Type */}
                  <Select
                    value={propertyTypeId}
                    onValueChange={setPropertyTypeId}
                  >
                    <SelectTrigger className="w-full">
                      <Building2/>
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {String(type.name).toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Up For */}
                  <Select value={upFor} onValueChange={setUpFor}>
                    <SelectTrigger className="w-full">
                      <Upload/>
                      <SelectValue placeholder="Up For" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SALE">For Sale</SelectItem>
                      <SelectItem value="RENT">For Rent</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Active Status */}
                  <Select value={isActive} onValueChange={setIsActive}>
                    <SelectTrigger className="w-full">
                      <CircleCheck/>
                      <SelectValue placeholder="Active Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Boosted */}
                  <Select
                    value={isBoosted === null ? "" : String(isBoosted)}
                    onValueChange={(value) => setIsBoosted(value === "true")}
                  >
                    <SelectTrigger className="w-full">
                      <Zap/>
                      <SelectValue placeholder="Boosted" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Boosted</SelectItem>
                      <SelectItem value="false">Not Boosted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* </section> */}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map((property, index) => (
            <Card key={property.id} className="overflow-hidden pt-0 pb-4">
              <div className="relative">
                <img
                  src={property?.propertyImages?.[0]?.image?.url}
                  alt={property.title}
                  className="w-full h-56 object-cover"
                />
                {property.isBoosted && (
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setProperty(property);
                          setIndex(index);
                          setEditProperty(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {/* Edit */}
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-800 text-white disabled:bg-gray-400"
                      disabled={property?.isBoosted}
                      onClick={() => {
                        setProperty(property);
                        setIsBoosted(true);
                      }}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Boost
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pagination?.currentPage && (
          <DynamicPagination
            currentPage={pagination?.currentPage}
            totalPages={pagination?.totalPages}
            hasNext={pagination?.hasNext}
            hasPrevious={pagination?.hasPrevious}
            onPageChange={loadData}
          />
        )}

        {/* No Results */}
        {hasNoRecords && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No properties found matching your criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <PropertyListingDialog
        open={uploadProperty}
        onOpenChange={() => {
          setUploadProperty(false);
          setReload(!reload);
        }}
      />
      <PropertyEditForm
        property={property}
        isOpen={editProperty}
        index={index + 1}
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
