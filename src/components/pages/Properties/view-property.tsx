'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, MapPin, ArrowLeftCircleIcon } from "lucide-react";
import React, { useState } from 'react';
import Navbar from '../Home/Nav';
import Footer from '../Home/Footer';
import ContactAgentModal from './Dialogs/Contact-agent';
import ScheduleViewingModal from './Dialogs/schedule-viewing';
import Image from 'next/image';

// This would typically come from an API, using static data for now
const getPropertyById = (id: string) => {
  const properties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      price: "$1,250,000",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
      location: "Beverly Hills, CA",
      beds: 4,
      baths: 3,
      sqft: "3,500",
      type: "For Sale",
      description: "Experience luxury living in this stunning modern villa. Features include high ceilings, premium finishes, and panoramic views.",
      features: ["Smart Home System", "Pool", "Wine Cellar", "Home Theater", "3-Car Garage"],
      yearBuilt: 2020,
      parkingSpaces: 3,
    },
    {
      id: 2,
      title: "Downtown Apartment",
      price: "$450,000",
      image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80",
      location: "Downtown Seattle, WA",
      beds: 2,
      baths: 2,
      sqft: "1,200",
      type: "For Sale",
      description: "Live in the heart of the city with this stylish apartment. Enjoy easy access to restaurants, shops, and entertainment.",
      features: ["City Views", "Fitness Center", "Concierge", "Pet-Friendly", "In-Unit Laundry"],
      yearBuilt: 2015,
      parkingSpaces: 1,
    },
    {
      id: 3,
      title: "Suburban Family Home",
      price: "$750,000",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
      location: "Bellevue, WA",
      beds: 4,
      baths: 2.5,
      sqft: "2,800",
      type: "For Sale",
      description: "Perfect for families, this home offers a spacious layout with a large backyard and a quiet, friendly neighborhood.",
      features: ["Large Backyard", "Excellent Schools", "Fireplace", "Gourmet Kitchen", "Close to Parks"],
      yearBuilt: 2010,
      parkingSpaces: 2,
    }
  ];
  return properties.find(p => p.id === Number(id));
};

const PropertyDetails = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const property = getPropertyById(searchParams.get('id') || "");

  const [contactState, setContactState] = useState<boolean>(false);
  const [scheduleState, setScheduleState] = useState<boolean>(false);
  
  if (!property) {
    return <div className="container mx-auto px-4 py-8">Property not found</div>;
  }

  return (
    <React.Fragment>
        <Navbar/>

        <div className="min-h-screen bg-gray-50 mb-12">

            <div className="container mx-auto px-4 py-8">
                <ArrowLeftCircleIcon className='mb-4 cursor-pointer' size={25} onClick={() => router.back()}/>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="relative">
                    <Image
                      src={property.image}
                      alt={property.title}
                      className="w-full h-[500px] object-cover rounded-lg"
                      width={0}
                      height={0}
                    />
                    <Badge className="absolute top-4 left-4 bg-real-600">{property.type}</Badge>
                    <Badge className="absolute top-4 right-4 bg-white text-navy-900">{property.price}</Badge>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-navy-900">{property.title}</h1>
                    
                    <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{property.location}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-4 border-y">
                    <div className="text-center">
                        <div className="flex items-center justify-center">
                        <Bed className="h-5 w-5 mr-2" />
                        <span className="text-lg font-semibold">{property.beds}</span>
                        </div>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-semibold">{property.baths}</div>
                        <p className="text-sm text-gray-600">Bathrooms</p>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-semibold">{property.sqft}</div>
                        <p className="text-sm text-gray-600">Square Feet</p>
                    </div>
                    </div>

                    <div>
                    <h2 className="text-2xl font-semibold mb-3">Description</h2>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                    </div>

                    <div>
                    <h2 className="text-2xl font-semibold mb-3">Features</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-gray-600">
                            <span className="mr-2">•</span>
                            {feature}
                        </div>
                        ))}
                    </div>
                    </div>

                    <div className="flex gap-4">
                    <Button className="flex-1" size="lg"
                    onClick={() => setContactState(true)}>Contact Agent</Button>
                    <Button variant="outline" className="flex-1" size="lg"
                    onClick={() => setScheduleState(true)}>Schedule Viewing</Button>
                    </div>
                </div>
                </div>
            </div>
        </div>
          {contactState && <ContactAgentModal
            isOpen={contactState} 
            onClose={() => setContactState(false)}
            propertyTitle={property.title}
          />}
          {scheduleState && <ScheduleViewingModal
            isOpen={scheduleState} 
            onClose={() => setScheduleState(false)}
            propertyTitle={property.title}
          />}
        <Footer/>

    </React.Fragment>
  );
};

export default PropertyDetails;
