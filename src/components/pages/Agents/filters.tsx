'use client';
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  Filter,
  Grid,
  List,
  TrendingUp,
  SlidersHorizontal
} from "lucide-react";
import { AgentInterface } from "../../../../utils/interfaces";

interface AgentFiltersProps {
  // data : AgentInterface[];
  // setData : Function;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  filterBy: string;
  setFilterBy: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  totalAgents: number;
  filteredCount?: number;
  availableCount: number;
}

const AgentFilters = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  totalAgents,
  filteredCount,
  availableCount
}: AgentFiltersProps) => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* Search and Main Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                  }}
                  className="pl-10 border-0 bg-gray-50/80 focus:bg-white transition-colors"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-full sm:w-56 md:w-36 border bg-gray-50/80">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    {/* <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem> */}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-56 md:w-36 border bg-gray-50/80">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    {/* <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="sales">Sales Volume</SelectItem> */}
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* <div className="w-fit flex rounded-lg border bg-gray-50/80 p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 px-3"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div> */}
              </div>
            </div>
            
            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>
                  <span className="font-semibold text-gray-900">{filteredCount}</span> of {totalAgents} agents
                </span>
                <span className="text-gray-400">•</span>
                <span>
                  <span className="font-semibold text-green-600">{availableCount}</span> available now
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AgentFilters;