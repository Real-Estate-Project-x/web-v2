import { FC } from "react";
import { Button } from "../ui/button"
import { cn } from "@/lib/utils";

export default function LoadingCard() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
      {[0,1,2].map((index : number) => 
      <div key={index} className="property-card animate-pulse w-auto bg-gray-300 bg-white rounded-lg overflow-hidden shadow-md">
          <div className="relative h-64 bg-gray-300">
              <img 
                src={"https://via.placeholder.com/300"} 
                alt={""} 
                className="w-full h-full object-cover h-4 bg-gray-300"
              />
          </div>
          <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 h-4 bg-gray-300 text-gray-300"></h3>
              <div className="flex items-center mb-3h-4 bg-gray-300 h-4">
                <span className="text-sm"></span>
              </div>
              <div className="flex justify-between h-4 border-t pt-3">
                  <div className="flex items-center h-4 bg-gray-300">
                    <span className="text-sm"></span>
                  </div>
                  <div className="flex items-center h-4 bg-gray-300">
                    <span className="text-sm"></span>
                  </div>
                  <div className="flex items-center h-4 bg-gray-300">
                    <span className="text-sm"></span>
                  </div>
              </div>
              <Button variant="outline" className="w-full mt-4 text-gray-600 bg-gray-300"/>
          </div>
      </div>
      )}
    </div>
  );
}


export const LoaderCardPopularLocations :FC = () => {

  return (
    <div className="w-full container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="animate-pulse bg-gray-200 rounded-lg group relative overflow-hidden rounded-lg cursor-pointer h-[70vh]">

            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            <img 
                src={"https://via.placeholder.com/600x400"} 
                alt={""}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold text-white mb-2 uppercase"></h3>
            <div className="flex items-center gap-2 text-white/90 mb-3 capitalize bg-gray-200">
                <span></span>
            </div>
            <Button 
                variant="outline" 
                className="w-full bg-gray-200 text-white"/>
            </div>
        </div>
      ))}
    </div>
  );
}

export const TestimonialsLoaderCard :FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* {Array.from({ length: 3 }).map((_, index) => ( */}

        <div className="agent-card animate-pulse bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-10 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex flex-col items-center md:items-start">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-300 mb-4"></div>
                    <div className="flex items-center gap-1 mb-2">
                        <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                        <span className="h-4 w-10 bg-gray-300 rounded"></span>
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="h-6 w-40 bg-gray-300 rounded mb-1 mx-auto md:mx-0"></div>
                    <div className="h-4 w-60 bg-gray-200 rounded mb-3 mx-auto md:mx-0"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                            <span className="h-4 w-24 bg-gray-300 rounded"></span>
                        </div>
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                            <span className="h-4 w-24 bg-gray-300 rounded"></span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                            <span className="h-4 w-24 bg-gray-300 rounded"></span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <span
                                key={i}
                                className="bg-gray-200 h-6 w-16 rounded-full"
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      {/* ))} */}
    </div>
  );
}

export const LoaderViewProperty : FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="animate-pulse bg-gray-200 rounded-lg shadow-md p-6">
        <div className="flex flex-col gap-6">
          <div className="w-full h-[350px] sm:h-[400px] md:h-[500px] bg-gray-300 rounded-lg mb-4"></div>
          <div className="w-full space-y-4">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SearchResultsLoaderCard : FC = () => {
  return(
    <div className="">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="w-full h-64 animate-pulse bg-slate-200 rounded-lg shadow-md p-6 mb-6" key={index}>
            
        </div>
      ))}
    </div>
  );
}
export const AgentLoaderCard  : FC = () => {
  return (
    <div className="w-full container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 m-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="animate-pulse bg-slate-200 rounded-lg group relative overflow-hidden rounded-lg cursor-pointer h-[70vh]">

          <div className="w-full flex justify-center py-8">
            <img 
              src={"https://via.placeholder.com/600x400"} 
              alt={""}
              className="w-40 h-40 bg-gray-200 object-cover transition-transform duration-300 group-hover:scale-110 rounded-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
             <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold bg-white"/>
                  <div className="text-xs bg-gray-500"/>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold bg-white"/>
                  <div className="text-xs bg-gray-500"/>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold bg-white"></div>
                  <div className="text-xs bg-gray-500"></div>
                </div>
              </div>

              {/* Location */}
              <div className="w-full items-center gap-2 mb-4 bg-white"/>
          </div>
        </div>
      ))}
    </div>
  );
}

interface LoadingCardProps {
  lines?: number;
  className?: string;
}

export function LoaderCard({ lines = 3, className }: LoadingCardProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted animate-pulse rounded"
          style={{
            width: `${Math.random() * 30 + 70}%`,
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
}