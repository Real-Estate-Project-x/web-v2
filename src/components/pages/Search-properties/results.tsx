"use client";

import Link from "next/link";
import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, Heart, Share, Phone } from "lucide-react";
import { formatPrice } from "../../../../utils/helpers";
import { SearchPropertyInterfaceType } from "../../../../utils/interfaces";

type Props = {
  data: SearchPropertyInterfaceType[];
};

const SearchResultsList: FC<Props> = ({ data }) => {
  const router = useRouter();

  const constructImageUrl = (property: SearchPropertyInterfaceType) => {
    const firstImage = property.property.propertyImages.shift();
    return (
      (firstImage as any)?.image?.url ??
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
    );
  };

  useEffect(() => {
    console.log({ data });
  }, []);

  return (
    <div className="space-y-6">
      {data?.map((property: SearchPropertyInterfaceType) => (
        <Card
          key={property?.property?.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col md:flex-row">
            {/* Property Image */}
            <div className="w-full md:w-1/3 relative h-auto md:h-auto">
              <img
                src={constructImageUrl(property)}
                alt={property?.property?.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-real-600 capitalize">
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
            <CardContent className="md:w-2/3 p-4 md:p-6">
              <div className="flex flex-col-reverse md:justify-between items-start mb-4">
                <div className="space-y-4">
                  <h3 className="text-xl lg:text-2xl font-bold text-[#102A43] mb-2 capitalize">
                    {property?.property?.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-base capitalize">
                      {property?.property?.address}
                    </span>
                  </div>
                  <p className="text-gray-700 text-base mb-3 capitalize">
                    {property?.property?.description?.length <= 30 ? property?.property?.description : property?.property?.description?.concat('...') }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl lg:text-2xl font-bold text-real-600">
                    {formatPrice(property?.property?.price)}
                  </div>
                  {/* <div className="text-sm text-gray-600">Built in {property.property.}</div> */}
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex flex-col space-y-4 md:space-y-2 md:justify-between md:items-center mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-1 text-gray-600" />
                  <span className="text-sm font-medium">
                    {property?.property?.noOfBedrooms} beds
                  </span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-1 text-gray-600" />
                  <span className="text-sm font-medium">
                    {property?.property?.noOfToilets} baths & Toilets
                  </span>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-1 text-gray-600" />
                  <span className="text-sm font-medium">
                    {property?.property?.sizeInSquareFeet} sqft
                  </span>
                </div>
                {/* <div className="text-sm text-gray-600">
                    {property.daysOnMarket} days on market
                  </div> */}
              </div>

              {/* Agent Info & Actions */}
              <div className="flex flex-col space-y-2  md:justify-between md:items-center">
                <div className="text-sm text-gray-600">
                  <p className="text">(Agency Info)</p>
                  <div className="font-medium capitalize my-2">
                    {property?.property?.agency?.name}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {property?.property?.agency?.agencyPhoneNumber}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/properties/view?id=${property?.property.slug}#schedule-tour`}
                  >
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                    >
                      Schedule Tour
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    className="cursor-pointer bg-[#2563EB] hover:bg-[#1D4ED8]"
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
