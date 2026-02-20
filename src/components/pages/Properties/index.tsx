"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "../Home/Nav";
import React, { FC, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Bath, Bed, Building, Coins, MapPin, Search, Square, Type } from "lucide-react";
import Footer from "../Home/Footer";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  PaginationControlInterface,
  PropertyInterface,
} from "../../../../utils/interfaces";
import { formatPrice } from "../../../../utils/helpers";
import LoadingCard from "@/components/shared/loader-cards";
import { axiosInstance } from "@/lib/axios-interceptor";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";

type Props = {
  array: PropertyInterface[];
};

type FilterProps = {
  setData: Function;
  setLoader: Function;
  setType: Function;
  data?: PropertyInterface[];
  copyData: PropertyInterface[];
  setCopyData: Function;
  isApi?: boolean;
};
export const PropertyFilter: FC<FilterProps> = ({
  setData,
  setLoader,
  setType,
  copyData,
  setCopyData,
  isApi = true,
}) => {
  //const [dataState, setDataState] = useState<PropertyInterface[]>(data);

  const onChangeHandler = (value: string) => {
    setType(value);
    filterProperties(value);
  };

  const filterProperties = async (type: string) => {
    await axiosInstance
      .get(`property/customer-listings/by-property-action/${type}`)
      .then((response) => {
        if (response.data.success) {
          setData(response.data.data);
          setCopyData(response.data.data);
        }
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.error("Error fetching properties:", error);
      });
  };

  const filterByUpFor = (upFor: string) => {
    const filteredData = copyData.filter(
      (property) => property.upFor.toLowerCase() === upFor.toLowerCase()
    );
    setData(filteredData);
  };

  return (
    <div className="w-full flex flex-wrap gap-3">
      <div className="w-full flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 relative flex flex-row gap-2 items-center">
          <Input
            type="text"
            placeholder="Search by location, property type..."
            className="w-full pl-10 h-12"
            onChange={(e) => {
              if (e.target.value === "") {
                // If search term is empty, reset to original data
                setData(copyData);
                return;
              }
              const searchTerm = e.target.value.toLowerCase();
              //filter properties based on search term
              //using the data in state
              const filteredData = copyData.filter(
                (property) =>
                  property.address.toLowerCase().includes(searchTerm) ||
                  property.title.toLowerCase().includes(searchTerm) ||
                  property.upFor.toLowerCase().includes(searchTerm)
              );
              setData(filteredData);
            }}
          />
          <Search className="absolute left-3 top-3 h-5 w-5 mt-0.5 text-gray-400" />
        </div>
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <Select
            onValueChange={(value: string) => {
              const [minPrice, maxPrice] = value.split("-");
              const filteredData = copyData.filter((property) => {
                if (!maxPrice) {
                  return property.price >= parseInt(minPrice);
                }

                return (
                  property.price >= parseInt(minPrice) &&
                  property.price <= parseInt(maxPrice)
                );
              });

              setData(filteredData);
            }}
          >
            <SelectTrigger className="w-full sm:w-[250px] md:w-[200px] lg:w-[140px] py-6">
              <Coins/>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="200-500">₦200k - ₦500k</SelectItem>
              <SelectItem value="500-1000000">₦500k - ₦1M</SelectItem>
              <SelectItem value="1000000-2000000">₦1M - ₦2M</SelectItem>
              <SelectItem value="2000000-5000000">₦2M - ₦5M</SelectItem>
              <SelectItem value="5000000-">₦5M+</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value: string) =>
              isApi ? onChangeHandler(value) : filterByUpFor(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[250px] md:w-[200px] lg:w-[140px] py-6">
              <Building/>
              <SelectValue placeholder="Property For?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RENT">{"RENT"}</SelectItem>
              <SelectItem value="SALE">{"SALE"}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value: string) => {
              const filteredData = copyData.filter(
                (property) =>
                  property.propertyType.name.toLowerCase() === value.toLowerCase()
              );
              setData(filteredData);
            }}
          >
            <SelectTrigger className="w-full sm:w-[250px] md:w-[200px] lg:w-[140px] py-6">
              <Type/>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="duplex">Duplex</SelectItem>
              <SelectItem value="Bungalow">Bungalow</SelectItem>
              {/* <SelectItem value="Office spaces">Office Spaces</SelectItem> */}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value: string) => {
              const filteredData = copyData.filter((property) => {
                const numOfBeds = parseInt(value);
                if (numOfBeds === 5) {
                  return property.noOfBedrooms >= 5;
                }
                return property.noOfBedrooms === numOfBeds;
              });

              setData(filteredData);
            }}
          >
            <SelectTrigger className="w-full sm:w-[250px] md:w-[200px] lg:w-[140px] py-6">
              <Bed/>
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bed</SelectItem>
              <SelectItem value="2">2 Beds</SelectItem>
              <SelectItem value="3">3 Beds</SelectItem>
              <SelectItem value="4">4 Beds</SelectItem>
              <SelectItem value="5">5+ Beds</SelectItem>
            </SelectContent>
          </Select>
        </section>
      </div>
    </div>
  );
};

export const PropertyList: FC<Props> = ({ array }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
      {array &&
        array.map((property) => (
          <div key={property?.id}>
            <Card
              key={property?.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white cursor-pointer group"
              onClick={() =>
                router.push(`/properties/view?id=${property?.slug}`)
              }
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property?.propertyImages?.[0]?.image?.url}
                  alt={property?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge
                  className={`${
                    property?.upFor === "RENT" ? "bg-[#0253CC]" : "bg-green-800"
                  } absolute top-4 left-4 hover:bg-real-700 capitalize px-4 py-1.5 rounded-full`}
                >
                  {property?.upFor.toLowerCase()}
                </Badge>
                {property?.isNewBuilding && (
                  <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
                    New
                  </Badge>
                )}
                <Badge className="absolute bottom-4 right-4 bg-white text-foreground shadow-lg py-1.5 rounded-xl">
                  {formatPrice(property?.price)}
                </Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors capitalize">
                  {property?.title}
                </h3>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm capitalize">
                    {property?.address}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground border-t pt-4">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span className="text-sm">
                      {property?.noOfBedrooms} beds
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span className="text-sm">
                      {property?.noOfToilets} Toilets
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    <span className="text-sm">
                      {property?.sizeInSquareFeet} sqft
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
    </div>
  );
};

const Properties = () => {
  const [properties, setProperties] = useState<PropertyInterface[]>([]);
  const [copyData, setCopyData] = useState<PropertyInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [type, setType] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );

  // const [currentPage, setCurrentPage] = useState<number>(() => {
  //   const savedPage = getCookie("page");
  //   return savedPage ? Number(savedPage) : 1;
  // });
  // const recordsPerPage: number = 10;
  // const lastIndex: number = currentPage * recordsPerPage;
  // const firstIndex: number = lastIndex - recordsPerPage;
  // const records = properties?.slice(firstIndex, lastIndex);
  // const nPage = Math.ceil(properties?.length / recordsPerPage);
  // const numbers = Array.from({ length: nPage }, (_, i) => i + 1).slice();

  useEffect(() => {
    loadData(1);
  }, []);

  const loadData = async (page: number) => {
    await fetchProperties(page);
  };

  async function fetchProperties(pageNumber = 1, pageSize = 10) {
    const url = `/property/customer-listings/featured-properties/?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        const {
          data: { data, paginationControl },
        } = response;
        setCopyData(data);
        setProperties(data);
        setPagination(paginationControl);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching properties:", error);
    }
  }

  return (
    <React.Fragment>
      <Navbar />
      <div className="mx-6 sm:mx-10 md:mx-16 mt-24 mb-10">
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#102A43] mb-2">Find Your Dream Home</h1>
          <p className="text-[#486581] max-w-xl font-normal">
            Explore sought-after locations trusted by buyers and renters alike.
          </p>
        </div>

        <PropertyFilter
          setData={setProperties}
          setLoader={setIsLoading}
          setType={setType}
          copyData={copyData}
          setCopyData={setCopyData}
        />

        {isLoading ? (
          <div className="flex justify-start">
            <LoadingCard />
          </div>
        ) : properties.length <= 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg pt-6">
              {(type && type.toLowerCase() === "RENT") ||
              type.toLowerCase() === "SALE"
                ? `No properties for ${type} available at the moment`
                : "No properties available at the moment"}
              .
            </p>
          </div>
        ) : (
          <PropertyList array={properties} />
        )}

        {pagination?.currentPage && (
          <DynamicPagination
            currentPage={pagination?.currentPage}
            totalPages={pagination?.totalPages}
            hasNext={pagination?.hasNext}
            hasPrevious={pagination?.hasPrevious}
            onPageChange={loadData}
          />
        )}
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default Properties;
