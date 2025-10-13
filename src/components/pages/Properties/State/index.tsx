"use client";
import { FC, useState, Fragment, useEffect } from "react";
import Footer from "../../Home/Footer";
import Navbar from "../../Home/Nav";
import { PropertyFilter, PropertyList } from "..";
import LoadingCard from "@/components/shared/loader-cards";
import { Pagination } from "@/components/shared/pagination";
import { PropertyInterface } from "../../../../../utils/interfaces";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios-interceptor";
import { getCookie } from "@/lib/helpers";

export const StatePropertyList: FC = () => {
  const [properties, setStateProperties] = useState<PropertyInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const stateId = searchParams.get("stateId") || "1"; // Default to 1 if not provided
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
  const numbers = Array.from({ length: nPage }, (_, i) => i + 1).slice();

  useEffect(() => {
    axiosInstance
      .get(`property/customer-listings/by-state/${stateName}`)
      .then((response) => {
        if (response.data.success) {
          setStateProperties(response.data.data);
          setCopyData(response.data.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching properties:", error);
      });
  }, []);

  return (
    <Fragment>
      <Navbar />
      <div className="p-4 sm:p-0 container mx-auto mt-24 mb-10">
        <h2 className="text-3xl font-normal text-navy-900 pb-5 pb-4 capitalize">
          Properties In {stateName}
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

        {numbers.length > 1 && (
          <Pagination
            _data={numbers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      <Footer />
    </Fragment>
  );
};
