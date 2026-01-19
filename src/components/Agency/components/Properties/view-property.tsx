'use client';


import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Eye, 
  Calendar,
  //DollarSign
} from "lucide-react";
import { AgentDatabaseInterface } from "../../../../../utils/interfaces";
import { convertDateCreatedToGetNumberOfDays, formatPrice } from "../../../../../utils/helpers";


interface AgentPropertyViewProps {
  property: AgentDatabaseInterface | null;
  isOpen: boolean;
  onClose: () => void;
  onBoost: (propertyId: number) => void;
}

const AgentPropertyView: React.FC<AgentPropertyViewProps> = ({
  property,
  isOpen,
  onClose,
  onBoost
}) => {
  if (!property) return null;


  const getStatusBadge = (status: string) => {
    const variants = {
      "Active": "default",
      "Pending": "secondary",
      "Sold": "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  const handleBoost = () => {
    onBoost(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{property.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Photo Carousel */}
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {property?.propertyImages?.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative">
                      <img
                        src={image?.image?.url}
                        alt={`${property.title} - Photo ${index + 1}`}
                        className="w-full h-[400px] object-cover rounded-lg"
                        // width={500}
                        // height={0}
                        //aspect-[16/9]
                        // fill
                        // sizes="33vw"
                      />
                      {index === 0 && property.isBoosted && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Zap className="h-3 w-3 mr-1" />
                            Boosted
                          </Badge>
                        </div>
                      )}
                      {index === 0 && (
                        <div className="absolute top-4 left-4">
                          {getStatusBadge(property.status ? "Active" : "Sold")}
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-3xl font-bold text-primary">{formatPrice(property?.price ? property.price : 0)}</h3>
                  <Badge variant="outline">{property?.propertyType?.name}</Badge>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{property.address}</span>
                </div>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{property.noOfBedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{property.noOfToilets}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Square className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{property.sizeInSquareFeet}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Property Statistics</h4>
              <div className="grid gap-4">
                <Card className="h-fit p-0">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-4">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-sm">{"pending....."}</div>
                        <div className="text-sm text-muted-foreground text-sm">Views</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="h-fit p-0">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-semibold text-sm">{convertDateCreatedToGetNumberOfDays(property.dateCreated)}</div>
                        <div className="text-sm text-muted-foreground text-sm">Days on Market</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Listed on: {new Date(property.dateCreated).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Property Description */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Property Description</h4>
            <p className="text-muted-foreground leading-relaxed text-sm">
              This beautiful {property?.propertyType?.name.toLowerCase()} offers {property.noOfBedrooms} bedrooms and {property.noOfToilets} bathrooms 
              in a prime location. With {property.sizeInSquareFeet} square feet of living space, this property provides excellent value 
              and has been attracting significant interest from potential buyers. The property features modern amenities 
              and is located in a desirable neighborhood with easy access to local amenities.
            </p>
          </div>

          <section className="my-4">
            {/* {!property.isBoosted && (
              <Button onClick={handleBoost} className="bg-yellow-500 hover:bg-yellow-600">
                <Zap className="h-4 w-4 mr-2" />
                Boost Property
              </Button>
            )}
            {property.isBoosted && (
              <Button disabled className="bg-green-600 text-white">
                <Zap className="h-4 w-4 mr-2" />
                Already Boosted
              </Button>
            )} */}
          </section>
          {/* additional costs should be added */}
          <p className="text-base pt-2 font-medium">Additional Costs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {property?.additionalCosts && property.additionalCosts.length > 0
              ? property.additionalCosts.map((cost, index) => (
                  <div className="text-start" key={index}>
                    <div className="text-lg font-semibold">{formatPrice(cost.price || 0)}</div>
                    <p className="text-sm text-gray-600">{cost.title}</p>
                  </div>
                ))
              : ''
            }
          </div>
          

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Property ID: #{property.id}
            </div>
            <div className="flex gap-3">
              <Button variant={"outline"} onClick={onClose}>
                Close
              </Button>
              <Button variant="destructive" onClick={onClose}>
                Delete&nbsp;Property
              </Button>
              
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentPropertyView;