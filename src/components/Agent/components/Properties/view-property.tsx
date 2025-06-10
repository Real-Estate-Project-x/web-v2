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
import Image from "next/image";

interface Property {
  id: number;
  title: string;
  address: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  daysOnMarket: number;
  views: number;
  isBoosted: boolean;
  image: string;
  dateAdded: string;
}

interface AgentPropertyViewProps {
  property: Property | null;
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

  // Mock additional property images - in real app this would come from the property data
  const propertyImages = [
    property.image,
    "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80"
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "Active": "default",
      "Pending": "secondary",
      "Sold": "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  const handleBoost = () => {
    onBoost(property.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Photo Carousel */}
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {propertyImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative">
                      <img
                        src={image}
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
                          {getStatusBadge(property.status)}
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
                  <h3 className="text-3xl font-bold text-primary">{formatPrice(property.price)}</h3>
                  <Badge variant="outline">{property.type}</Badge>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{property.address}</span>
                </div>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Square className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">{property.sqft}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Property Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <Card className="h-fit p-0">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-sm">{property.views}</div>
                        <div className="text-sm text-muted-foreground text-sm">Views</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="h-fit p-0">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-semibold text-sm">{property.daysOnMarket}</div>
                        <div className="text-sm text-muted-foreground text-sm">Days on Market</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Listed on: {new Date(property.dateAdded).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Property Description */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Property Description</h4>
            <p className="text-muted-foreground leading-relaxed">
              This beautiful {property.type.toLowerCase()} offers {property.bedrooms} bedrooms and {property.bathrooms} bathrooms 
              in a prime location. With {property.sqft} square feet of living space, this property provides excellent value 
              and has been attracting significant interest from potential buyers. The property features modern amenities 
              and is located in a desirable neighborhood with easy access to local amenities.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Property ID: #{property.id}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {!property.isBoosted && (
                <Button onClick={handleBoost} className="bg-yellow-500 hover:bg-yellow-600">
                  <Zap className="h-4 w-4 mr-2" />
                  Boost Property
                </Button>
              )}
              {property.isBoosted && (
                <Button variant="secondary" disabled>
                  <Zap className="h-4 w-4 mr-2" />
                  Already Boosted
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentPropertyView;