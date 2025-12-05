'use client';

import React, { FC } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { LocationsInterface } from '../../../../utils/interfaces';
import { LoaderCardPopularLocations } from '@/components/shared/loader-cards';


type Location = {
  data : LocationsInterface[];
}
const PopularLocations : FC<Location> = ({data}) => {

    const router = useRouter();

  return (
    <>
      {!data && <LoaderCardPopularLocations/>} 
                
      {data && data.length > 0 &&
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-navy-900 mb-8">Popular Locations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.slice(0,3).map((location : LocationsInterface) => (
                  <div key={location.state.id}
                    className="group relative overflow-hidden rounded-lg cursor-pointer h-[50vh]"
                    onClick={() => router.push(`/properties/by-state?stateId=${location.state.id}&name=${location.state.name}`)}>

                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src={"https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80"} 
                        alt={location.state.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 uppercase">{location.state.initials}</h3>
                      <div className="flex items-center gap-2 text-white/90 mb-3 capitalize">
                        <MapPin className="h-4 w-4" />
                        <span>{location.state.name}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                        {location.propertyCount} Properties
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </section>
      }
    </>
  );
};

export default PopularLocations;