"use client";

import { FC, useState, Fragment, useEffect } from "react";
import Footer from "../../Home/Footer";
import Navbar from "../../Home/Nav";
import { PropertyFilter, PropertyList } from "..";
import LoadingCard from "@/components/shared/loader-cards";
import {
  PaginationControlInterface,
  PropertyInterface,
} from "../../../../../utils/interfaces";
import { getCookie } from "@/lib/helpers";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios-interceptor";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";

export const StatePropertyList: FC = () => {
  const [properties, setStateProperties] = useState<PropertyInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const stateName = searchParams.get("name") || "State";
  const [type, setType] = useState<string>("");
  const [copyData, setCopyData] = useState<PropertyInterface[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const savedPage = getCookie("page");
    return savedPage ? Number(savedPage) : 1;
  });
  const recordsPerPage: number = 10;
  const lastIndex: number = currentPage * recordsPerPage;
  const firstIndex: number = lastIndex - recordsPerPage;
  const records = properties?.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(properties?.length / recordsPerPage);
  const [pagination, setPagination] = useState<PaginationControlInterface>(
    {} as PaginationControlInterface
  );

  const fetchPropertiesByState = async (pageNumber = 1, pageSize = 10) => {
    const url = `property/customer-listings/by-state/${stateName}/?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    try {
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        const {
          data: { data, paginationControl },
        } = response;
        setCopyData(data);
        setStateProperties(data);
        setPagination(paginationControl);
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

  useEffect(() => {
    loadData(1);
  }, []);

  return (
    <Fragment>
      <Navbar />
      <div className="p-4 sm:p-0 container mx-auto mt-24 mb-10">
        <h2 className="text-3xl font-normal text-navy-900 pb-5 pb-4 capitalize">
          <b>Properties In:: {stateName}</b>
        </h2>

        <PropertyFilter
          setLoader={setIsLoading}
          setData={setStateProperties}
          setType={setType}
          isApi={false}
          copyData={copyData}
          setCopyData={setCopyData}
        />

        {isLoading ? (
          <div className="flex justify-start">
            <LoadingCard />
          </div>
        ) : records?.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg">
              No properties for {stateName} available at the moment.
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
};
