'use client';

import { Button } from "@/components/ui/button";
import { Property } from "../../../../../utils/interfaces";
import { MessageSquare } from "lucide-react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useState } from "react";

//const AgentProperties = ({ agent, onMessageClick }: { agent: Agent; onMessageClick: () => void }) => {
  export const AgentProperties = ({ onMessageClick,propertiesPerPage}: { onMessageClick: () => void; propertiesPerPage: number;}) => {
    // Sample properties data
    const [currentPage, setCurrentPage] = useState<number>(1);

    const properties: Property[] = [
      { id: 1, address: "123 Main St Unit 1", price: "$550,000", beds: 3, baths: 2, status: "Available" },
      { id: 2, address: "123 Main St Unit 2", price: "$590,000", beds: 3, baths: 2, status: "Available" },
      { id: 3, address: "456 Oak Ave Unit 1", price: "$450,000", beds: 2, baths: 1, status: "Pending" },
      { id: 4, address: "789 Pine Rd Unit 1", price: "$750,000", beds: 4, baths: 3, status: "Available" },
      { id: 5, address: "123 Main St Unit 3", price: "$520,000", beds: 3, baths: 2, status: "Sold" },
      { id: 6, address: "456 Oak Ave Unit 2", price: "$480,000", beds: 2, baths: 1, status: "Available" },
      { id: 7, address: "789 Pine Rd Unit 2", price: "$780,000", beds: 4, baths: 3, status: "Available" },
      { id: 8, address: "123 Main St Unit 4", price: "$540,000", beds: 3, baths: 2, status: "Available" },
    ];
  
   
  // Get current properties
  //const indexOfLastProperty = currentPage * propertiesPerPage;
 // const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  //const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const getStatusColor = (status: Property["status"]) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Sold": return "bg-gray-100 text-gray-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl font-semibold">Properties by {"John Doe"}</h1>
        <Button onClick={onMessageClick} className="w-full sm:w-auto bg-[#0253CC]">
          <MessageSquare className="mr-2 h-4 w-4" />
          Message Agent
        </Button>
      </div>
      
      {/* Custom table layout with divs */}
      <div className="w-full overflow-x-auto rounded-md">
        {/* Table Header */}
        <div className="border-b grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1.5fr_auto_auto_auto] lg:grid-cols-[2fr_1fr_1fr_1fr] w-full">
          <div className="p-4 font-normal text-gray-700">Property</div>
          <div className="p-4 font-normal text-gray-700">Price</div>
          <div className="p-4 font-normal text-gray-700">Status</div>
          <div className="p-4 font-normal text-gray-700">Actions</div>
        </div>
        
        {/* Table Body */}
        <div className="divide-y">
          {properties.map((property) => (
            <div key={property.id} className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1.5fr_auto_auto_auto] lg:grid-cols-[2fr_1fr_1fr_1fr] w-full hover:bg-gray-50 transition-colors">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div>
                    <p className="font-medium">{property.address}</p>
                    <p className="text-sm text-gray-500">{property.beds} beds • {property.baths} baths</p>
                  </div>
                </div>
              </div>
              <div className="p-4 self-center">{property.price}</div>
              <div className="p-4 self-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
              <div className="p-4 self-center">
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination */}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} 
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationItem key={page}>
              <PaginationLink 
                onClick={() => setCurrentPage(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} 
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};


//};

//export default AgentProperties