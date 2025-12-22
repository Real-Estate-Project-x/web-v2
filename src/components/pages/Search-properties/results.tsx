"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, Heart, Share, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { SearchPropertyInterfaceType } from "../../../../utils/interfaces";
import { formatPrice } from "../../../../utils/helpers";

type Props = {
  data: SearchPropertyInterfaceType[];
};

const SearchResultsList: FC<Props> = ({ data }) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {data?.map((property: SearchPropertyInterfaceType) => (
        <Card
          key={property?.property?.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="md:flex">
            {/* Property Image */}
            <div className="md:w-1/3 relative h-64 md:h-auto">
              <img
                src={property?.property?.photoUrls?.[0]}
                alt={property?.property?.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-real-600">
                  {property?.property?.propertyType?.name}
                </Badge>
                {property?.property?.isNewBuilding && (
                  <Badge className="bg-green-500">New</Badge>
                )}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Property Details */}
            <CardContent className="md:w-2/3 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#102A43] mb-2 capitalize">
                    {property?.property?.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm capitalize">
                      {property?.property?.address}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3 capitalize">
                    {property?.property?.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-real-600">
                    {formatPrice(property?.property?.price)}
                  </div>
                  {/* <div className="text-sm text-gray-600">Built in {property.property.}</div> */}
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="text-sm font-medium">
                    {property?.property?.noOfBedrooms} beds
                  </span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="text-sm font-medium">
                    {property?.property?.noOfToilets} baths & Toilets
                  </span>
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="text-sm font-medium">
                    {property?.property?.sizeInSquareFeet} sqft
                  </span>
                </div>
                {/* <div className="text-sm text-gray-600">
                    {property.daysOnMarket} days on market
                  </div> */}
              </div>

              {/* Agent Info & Actions */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <div className="font-medium capitalize my-2">
                    {property?.property?.agency?.name}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {property?.property?.agency?.agencyPhoneNumber}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Schedule Tour
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#2563EB] hover:bg-[#1D4ED8]"
                    onClick={() =>
                      router.push(
                        `/properties/view?id=${property?.property.slug}`
                      )
                    }
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SearchResultsList;
