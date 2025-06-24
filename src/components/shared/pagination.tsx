'use client';

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  _data: any[];
}

export const Pagination :FC<Props> = ({_data}) => {

    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        setActiveIndex((prevIndex) =>
        prevIndex === 0 ? _data.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) =>
        prevIndex === activeIndex - 1 ? 0 : prevIndex + 1
        );
    }

  return (
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
            
        {_data.map((_, index : number) => (
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
            className="h-8 w-8 md:h-10 md:w-10">
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
    </div>
  );
}