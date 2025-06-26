'use client';

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Mail, MapPin, Phone, Star,  } from "lucide-react";
import Image from "next/image";
import { AgentInterface } from "../../../../utils/interfaces";
import { TestimonialsLoaderCard } from "@/components/shared/loader-cards";

type Props = {
  _data_for_TopAgents : AgentInterface[];
}

const Testimonials :FC<Props> = ({_data_for_TopAgents}) => {
  // State to manage the active agent index
 const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? _data_for_TopAgents.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === activeIndex - 1 ? 0 : prevIndex + 1
    );
  }
  return (
    <section className="py-8 md:py-16 bg-real-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
            Top Agents
          </h2>
          <p className="text-navy-600 max-w-2xl mx-auto text-sm md:text-base">
            Meet our exceptional real estate professionals who consistently deliver outstanding results for our clients.
          </p>
        </div>

        {!_data_for_TopAgents || _data_for_TopAgents.length === 0 ? (<TestimonialsLoaderCard/>)
          :    
          <div className="max-w-4xl mx-auto relative">
            <div className="agent-card bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-10 mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <img
                    src={_data_for_TopAgents[activeIndex].agency.logo}
                    alt={_data_for_TopAgents[activeIndex].agency.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mb-4"
                  />
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-navy-900">
                      {_data_for_TopAgents[activeIndex].agency.rating}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl md:text-2xl font-bold text-navy-900 mb-1 capitalize">
                    {_data_for_TopAgents[activeIndex].agency.name}
                  </h4>
                  <p className="text-navy-600 mb-3 text-sm md:text-base">
                    {_data_for_TopAgents[activeIndex].agency.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center justify-center md:justify-start gap-2 capitalize">
                      <MapPin className="h-4 w-4 text-navy-500" />
                      <span className="text-navy-700 text-sm">
                        {_data_for_TopAgents[activeIndex].agency.address}
                      </span>
                    </div>
                    <div className="text-navy-700 text-sm">
                      {/* {_data_for_TopAgents[activeIndex].properties.length} */}
                      <strong>{_data_for_TopAgents[activeIndex].propertyCount}</strong> Properties
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Phone className="h-4 w-4 text-navy-500" />
                      <span className="text-navy-700 text-sm">
                        {_data_for_TopAgents[activeIndex].agency.agencyPhoneNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="h-4 w-4 text-navy-500" />
                      <span className="text-navy-700 text-sm">
                        {_data_for_TopAgents[activeIndex].agency.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {/* add agent specialties in this section */}
                    {_data_for_TopAgents[activeIndex].tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 flex-wrap">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePrev}
                aria-label="Previous agent"
                className="h-8 w-8 md:h-10 md:w-10"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              
              {_data_for_TopAgents.map((_, index : number) => (
                <Button
                  key={index}
                  variant={index === activeIndex ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full text-xs md:text-sm"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to agent ${index + 1}`}
                >
                  {index + 1}
                </Button>
              ))}
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNext}
                aria-label="Next agent"
                className="h-8 w-8 md:h-10 md:w-10"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
      }
      </div>
    </section>
  );
}


export default Testimonials;
 