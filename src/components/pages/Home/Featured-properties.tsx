'use client';

import { ArrowRight} from "lucide-react";
import { Button } from "@/components/ui/button";
//import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { PropertyList } from "../Properties";
import { FC } from "react";
import { PropertyInterface } from "../../../../utils/interfaces";
import LoadingCard from "@/components/shared/loader-cards";
// Mock property data
export const properties = [
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
    isNew: true,
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
    isNew: false,
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
    isNew: false,
  }
];

type Property = {
  data : PropertyInterface[];
}

export const FeaturedProperties :FC<Property> = ({data}) => {

  const router = useRouter();
  // using js prompt ask the user to turn on geolocation for better access to properties
  if (typeof window !== 'undefined' && !navigator.geolocation) {  
    alert("Please enable geolocation in your browser settings for better access to properties.");
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-navy-900 mb-2">Featured Properties</h2>
            <p className="text-navy-600 max-w-xl font-light">
              Explore our handpicked selection of premium properties that match your lifestyle and preferences.
            </p>
          </div>
          <Button variant="outline" className="flex items-center mt-4 md:mt-0 font-md"
          onClick={() => router.push('/properties')}>
            View All Properties <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* use component below as card */}
        {
          !data || data.length === 0 ? 
            <LoadingCard/>
          :
           <PropertyList array={data}/>
        }
       
      </div>
    </section>
  );
};
