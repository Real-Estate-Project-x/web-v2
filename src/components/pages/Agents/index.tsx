'use client';

import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Navbar from "../Home/Nav";
import AgentFilters from "./filters";
import AgentCard from "./Agent-Card";
import Footer from "../Home/Footer";
import { AgentInitialObject, AgentInterface } from "../../../../utils/interfaces";
import { axiosInstance } from "@/lib/axios-interceptor";
import { AgentLoaderCard } from "@/components/shared/loader-cards";
import { getCookie } from "@/lib/helpers";
import { Pagination } from "@/components/shared/pagination";

const Agents = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");
  const [data, setData] = useState<AgentInterface[]>([{...AgentInitialObject}] as AgentInterface[]);
  const [errorMsg, setErrorObj] = useState<{msg : string, flag : boolean}>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataState, setDataState] = useState<AgentInterface[]>([{...AgentInitialObject}] as AgentInterface[]);
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const savedPage = getCookie('page');
    return savedPage ? Number(savedPage) : 1;
  });
  const recordsPerPage : number = 10;
  const lastIndex : number = currentPage * recordsPerPage;
  const firstIndex : number = lastIndex - recordsPerPage;
  const records = data?.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(data?.length / recordsPerPage);
  const numbers = Array.from({ length: nPage }, (_, i) => i + 1).slice();

  useEffect(() => {
    setIsLoading(true);

    axiosInstance.get(`agency/customer-listings/agents-list`)
    .then((response) => {
      if(response.data.success){
        setData(response.data.data);
        setDataState(response.data.data);
      }else{
        setErrorObj({...errorMsg, flag : true, msg : response.data.message});
      }
      setIsLoading(false);

    }).catch((err) => {
      setErrorObj({...errorMsg, flag : true, msg : err?.response?.data?.message});
      setIsLoading(false);
    })
    
  },[]);

  useEffect(() => {
      if(searchTerm === "") {
        // If search term is empty, reset to original data
        setData(dataState);
        return;
      }
      const filteredData = dataState.filter((agent) => 
        agent.agency.name.toLowerCase().includes(searchTerm) ||
        agent.agency.address.toLowerCase().includes(searchTerm) ||
        agent.agency.email.toLowerCase().includes(searchTerm) ||
        agent.agency.agencyPhoneNumber.includes(searchTerm) ||
        agent.propertyTypes.some((type) => 
          type.name.toLowerCase().includes(searchTerm)
        )
      );
      setData(filteredData);
  },[searchTerm]);

  useEffect(() => {
    if (filterBy === "all") {
      setData(dataState)
    } else if (filterBy === "available") {
      setData(dataState.filter(agent => agent?.agency?.status));
    }
  },[filterBy, data]);

   useEffect(() => {
    if (sortBy === "") {
      setData(dataState)
    } else if (sortBy === "name") {
      setData(dataState.sort((a,b) =>  a.agency.name.localeCompare(b.agency.name)));
    }else if (sortBy === "rating") {
      setData(dataState.sort((a,b) =>  b.agency.rating - a.agency.rating));
    }
  },[sortBy, data]);


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 */}
        <section className="relative bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 py-16 overflow-hidden ">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mt-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-6">
                Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Expert Agents</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Connect with experienced real estate professionals who deliver exceptional results and personalized service.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">{data.length}</div>
                  <div className="text-sm text-white/80">Expert Agents</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">
                    {(data.reduce((sum, agent) => sum + agent?.agency?.rating, 0) / data.length).toFixed(1)}
                  </div>
                  <div className="text-sm text-white/80">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        {isLoading  ?
        (<AgentLoaderCard/>) 
        : 
          <>
            <AgentFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalAgents={data.length}
              filteredCount={data.length}
              availableCount={data.filter(a => a?.agency?.status).length}
            />

            {/* Agents Grid/List */}
            <section className="py-8">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {records.map((agent) => (
                    <AgentCard key={agent?.agency.id} agent={agent} />
                  ))}
                </div>
              
                {data.length === 0 && (
                  <div className="text-center py-16">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-600 mb-2">No agents found</h3>
                      <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
                    </div>
                  </div>
                )}
                {numbers.length > 1 && <Pagination _data={numbers} currentPage={currentPage} setCurrentPage={setCurrentPage}/>}
              </div>
            </section>
          </>
        }
      </main>
      
      <Footer />
    </div>
  );
};

export default Agents;