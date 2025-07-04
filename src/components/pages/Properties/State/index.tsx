'use client';
import { FC, useState, Fragment, useEffect } from "react";
import Footer from "../../Home/Footer";
import Navbar from "../../Home/Nav";
import { PropertyFilter, PropertyList } from "..";
import LoadingCard from "@/components/shared/loader-cards";
import { Pagination } from "@/components/shared/pagination";
import { PropertyInterface } from "../../../../../utils/interfaces";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../../home";
import { returnHeaders } from "@/lib/utils";
import { getCookie } from "@/lib/helpers";

export const StatePropertyList: FC = () => {
    const [properties, setStateProperties] = useState<PropertyInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const stateId = searchParams.get("stateId") || "1"; // Default to 1 if not provided
    const stateName = searchParams.get("name") || "State";

    useEffect(() => {
        axios.get(`${API_BASE_URL}property/customer-listings/by-state/${stateId}`, {headers : returnHeaders(getCookie('user_ip'))})
        .then((response) => { 
            if(response.data.success) {
                setStateProperties(response.data.data);

            }
            setIsLoading(false);
        })
        .catch((error) => {
            setIsLoading(false);
            console.error("Error fetching properties:", error);
        });
    },[]);

    
    return (
    <Fragment>
        <Navbar/>
        <div className="container mx-auto mt-24 mb-10">
            <h2 className="text-3xl font-normal text-navy-900 pb-5 pb-4 capitalize">Properties In {stateName}</h2>

            <PropertyFilter/>

            {isLoading ? (
                <div className="flex justify-start">
                    <LoadingCard />
                </div>) 
                :
                (
                    properties?.length === 0 ? 
                        <div className="text-center text-gray-500">
                            <p className="text-lg">No properties for state available at the moment.</p>
                        </div>
                    :
                    <PropertyList array={properties}/>
                )
            }

            {properties.length > 6 && (<Pagination _data={properties} />)}
            

           
        </div>
        
        <Footer/>
    </Fragment>
  );
}