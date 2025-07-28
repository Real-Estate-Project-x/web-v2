'use client';
import { FC, useState, Fragment, useEffect } from "react";
import Footer from "../../Home/Footer";
import Navbar from "../../Home/Nav";
import { PropertyFilter, PropertyList } from "..";
import LoadingCard from "@/components/shared/loader-cards";
import { Pagination } from "@/components/shared/pagination";
import { PropertyInterface } from "../../../../../utils/interfaces";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios-interceptor";

export const StatePropertyList: FC = () => {
    const [properties, setStateProperties] = useState<PropertyInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const stateId = searchParams.get("stateId") || "1"; // Default to 1 if not provided
    const stateName = searchParams.get("name") || "State";
    const [type, setType] = useState<string>("");

    useEffect(() => {
        axiosInstance.get(`property/customer-listings/by-state/${stateId}`)
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
        <div className="p-4 sm:p-0 container mx-auto mt-24 mb-10">
            <h2 className="text-3xl font-normal text-navy-900 pb-5 pb-4 capitalize">Properties In {stateName}</h2>

            <PropertyFilter setLoader={setIsLoading} setData={setStateProperties} setType={setType}/>

            {isLoading ? (
                <div className="flex justify-start">
                    <LoadingCard />
                </div>) 
                :
                (
                    properties?.length === 0 ? 
                        <div className="text-center text-gray-500">
                            <p className="text-lg">No properties for {stateName} available at the moment.</p>
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