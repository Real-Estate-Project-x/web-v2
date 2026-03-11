'use client';

import { Fragment, useEffect, useState } from "react";
import Navbar from "../../Home/Nav";
import LoadingCard from "@/components/shared/loader-cards";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";
import { Footer } from "react-day-picker";
import { StateViewPropertyFilter } from "../State";
import { PropertyList } from "..";
import { PaginationControlInterface, PropertyInterface } from "../../../../../utils/interfaces";
import { axiosInstance } from "@/lib/axios-interceptor";
import { useSearchParams } from "next/navigation";
import { getCookie } from "@/lib/helpers";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { fetchAgencies, fetchPropertyTypes } from "../../../../../utils/helpers";

export const PropertiesByCountry = () => {

    // change endpionts to country name
    // add a new section to home page for properties of countries
    const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
    );
    const searchParams = useSearchParams();
    const countryName = searchParams.get("name") || "State";
    const [copyData, setCopyData] = useState<PropertyInterface[]>([]);
    const [properties, setStateProperties] = useState<PropertyInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [countryId, setCountryId] = useState<string>("");
    const [agencies, setAgencies] = useState<any[]>([]);
    const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(() => {
        const savedPage = getCookie("page");
        return savedPage ? Number(savedPage) : 1;
    });

    const recordsPerPage: number = 10;
    const lastIndex: number = currentPage * recordsPerPage;
    const firstIndex: number = lastIndex - recordsPerPage;
    const records = properties?.slice(firstIndex, lastIndex);

    const fetchPropertiesByState = async (pageNumber = 1, pageSize = 10) => {
        const url = `property/customer-listings/by-state/${countryName}/?pageNumber=${pageNumber}&pageSize=${pageSize}`;

        try {
            const response = await axiosInstance.get(url);
            if (response.data.success) {
            const {
                data: { data, paginationControl },
            } = response;
                setCopyData(data);
                setStateProperties(data);
                setPagination(paginationControl);
                setCountryId(data[0].stateId);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error fetching properties:", error);
            throw error;
        }
    };
    
    const loadData = async (page: number) => {
        await fetchPropertiesByState(page);
    };

     const handleChildData = async (filter: any) => {
    // Query api
    await globalSearch(1, 10, { ...filter, countryId });
  };

  const globalSearch = async (pageNumber = 1, pageSize = 10, payload = {}) => {
    setIsLoading(true);
    await fetchSearchResults(pageNumber, pageSize, payload);
    setIsLoading(false);
  };

    const fetchSearchResults = async (
        pageNumber = 1,
        pageSize = 10,
        payload = {}
    ) => {
        if (!countryId) return;

        const url = `/property/customer-listings/by-state/search/${countryId}`;

        try {
        const response = await axiosInstance.post(url, {
            payload,
            pagination: { pageNumber, pageSize },
        });
        if (response.data?.success) {
            const {
            data: { data, paginationControl },
            } = response;
            setStateProperties(data);
            setPagination(paginationControl);
        }
        } catch (error) {
        let message = "An error occurred";
        if (error instanceof AxiosError) {
            message = error.message;
        }
        toast(message, { description: JSON.stringify(error) });
        throw error;
        }
    };
    const postSavedSearch = async <T,>(payload: T): Promise<any> => {
        try {
            const url = "/saved-search/?fields=success,code,message";

            const response = await axiosInstance.post(url, payload);
            if (!response.data) return;

            return response.data;
        } catch (error) {
            throw error;
        }
    };
    const handleSaveSearch = async (filter: any) => {
        // Query api
        setIsLoading(true);
        const response = await postSavedSearch({ ...filter, countryId });
        setIsLoading(false);

        if (response?.success) {
        toast.success(response.message ?? "Saved search successfully");
        }
    };

    useEffect(() => {
        Promise.all([loadData(1), fetchAgencies(setAgencies, toast), fetchPropertyTypes(setPropertyTypes)]);
    }, []);

    return(
    <Fragment>
        <Navbar />
        <div className="p-4 sm:p-0 container mx-auto mt-24 mb-10">
            <h2 className="text-3xl font-normal text-navy-900 pb-5 pb-4 capitalize">
            <b>Properties In:: {countryName}</b>
            </h2>

            <StateViewPropertyFilter
            loader={isLoading}
            agencies={agencies}
            propertyTypes={propertyTypes}
            setLoader={setIsLoading}
            onSendData={handleChildData}
            onSaveData={handleSaveSearch}
            />

            {isLoading ? (
            <div className="flex justify-start">
                <LoadingCard />
            </div>
            ) : records?.length === 0 ? (
            <div className="text-center text-gray-500 pt-10">
                <p className="text-lg">
                No properties for <b>{countryName?.toUpperCase()}</b> available at
                the moment.
                </p>
            </div>
            ) : (
            <PropertyList array={records} />
            )}

            {pagination?.currentPage && (
                <DynamicPagination
                    currentPage={pagination?.currentPage}
                    totalPages={pagination?.totalPages}
                    hasNext={pagination?.hasNext}
                    hasPrevious={pagination?.hasPrevious}
                    onPageChange={loadData}
                />
            )}
        </div>
        <Footer />
    </Fragment>
    );
}