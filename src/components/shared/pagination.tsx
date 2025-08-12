'use client';

import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  _data: any[];
  currentPage: number;
  setCurrentPage?: (page: number) => void;
}

export const Pagination :FC<Props> = ({_data, currentPage, setCurrentPage}) => {


    const handlePrev = () => {
        if(currentPage !== 1 && setCurrentPage) {
            setCurrentPage(currentPage - 1);
        }
    }
    const handleNext = () => {
        if(setCurrentPage && currentPage !== _data.length) {
            setCurrentPage(currentPage + 1);
        }
    }
   
    const moveToPage = (id : number) => {
        if(setCurrentPage)
        setCurrentPage(id);
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
            
        {_data.slice(0,10).map((_, index : number) => (
            <Button
            key={index}
            variant={index + 1 === currentPage ? "default" : "outline"}
            size="sm"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full text-xs md:text-sm"
            onClick={() => moveToPage(index + 1)}
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