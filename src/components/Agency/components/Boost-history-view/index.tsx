"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Search, Zap } from "lucide-react";
import { Separator } from "@radix-ui/react-select";
import {
  formatPrice,
  getLocalStorageFieldRaw,
  convertDateCreatedToGetNumberOfDays,
} from "../../../../../utils/helpers";
import {
  AgentDatabaseInterface,
  PaginationControlInterface,
} from "../../../../../utils/interfaces";
import { axiosInstance } from "@/lib/axios-interceptor";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BoostPropertyPrompt } from "../Properties/agent-property-view";

interface PropertyType {
  property: AgentDatabaseInterface;
  isCurrentlyBoosted: boolean;
  numberOfBoosts: number;
  lastBoostedOn: Date;
}

const BoostHistoryView = ({}) => {
  const agencyId = getLocalStorageFieldRaw("agentId");
  const [isBoosted, setIsBoosted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] =
    useState<AgentDatabaseInterface>();
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const router = useRouter();

  const hasNoRecords = Array.isArray(properties) && properties.length <= 0;

  useEffect(() => {
    loadData(1);
  }, []);

  const loadData = async (page: number) => {
    await fetchBoostedProperties(page);
  };

  const handleSearch = async () => {
    const queryParams = {
      pageNumber: 1,
      pageSize: 10,
    };

    await fetchBoostedProperties(
      queryParams.pageNumber,
      queryParams.pageSize,
      searchTerm
    );
  };

  const fetchBoostedProperties = async (
    pageNumber = 1,
    pageSize = 10,
    searchTerm?: string
  ) => {
    const url = `/payment/agency-boost-history/${agencyId}`;
    try {
      const response = await axiosInstance.get(url, {
        params: {
          pageNumber,
          pageSize,
          ...(searchTerm && { searchTerm }),
        },
      });
      if (response.data?.success) {
        const {
          data: { data, paginationControl },
        } = response;

        setProperties(data);
        setPagination(paginationControl);

        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

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
        {/* Search and Filters */}
        <Card>
          <CardContent className="px-6 py-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div className="space-y-4">
                {/* 🔍 Row 1: Search + Sorting */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Search */}
                  <div className="relative lg:col-span-11">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="lg:col-span-1">
                    <Button type="submit" className="w-full">
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map(
            (
              { property, isCurrentlyBoosted, lastBoostedOn, numberOfBoosts },
              index
            ) => (
              <Card key={property.id} className="overflow-hidden pt-0 pb-4">
                <div className="relative">
                  <img
                    src={property?.propertyImages?.[0]?.image?.url}
                    alt={property.title}
                    className="w-full h-56 object-cover"
                  />
                  {isCurrentlyBoosted && (
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
                        {property.noOfBedrooms} bed • {property.noOfToilets}{" "}
                        bath
                      </span>
                      <span>{property.sizeInSquareFeet} sqft</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {numberOfBoosts} Boost(s) •{" "}
                        {format(lastBoostedOn, "dd/MM/yyyy")} Last Boosted
                      </span>
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
                          View
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-800 text-white disabled:bg-gray-400"
                        disabled={property?.isBoosted}
                        onClick={() => {
                          setIsBoosted(true);
                          setSelectedProperty(property);
                        }}
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        {numberOfBoosts >= 1 && !isCurrentlyBoosted
                          ? "RE-Boost"
                          : "Boost"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}
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

        {selectedProperty && (
          <BoostPropertyPrompt
            isOpen={isBoosted}
            onClose={() => setIsBoosted(false)}
            id={selectedProperty?.id}
            setBoost={() => setIsBoosted(true)}
          />
        )}
      </div>
    </>
  );
};

export default BoostHistoryView;
