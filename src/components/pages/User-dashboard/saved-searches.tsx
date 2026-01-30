import Link from "next/link";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios-interceptor";
import SavedSearchCard from "@/components/shared/saved-search-card";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";

export const DashboardSavedSearch = () => {
  const [loading, setLoading] = useState(false);
  const [totalSearches, setTotalSearches] = useState(0);
  const [searches, setSearches] = useState([]);
  const [pagination, setPagination] = useState<any>(null);

  const fetchData = async (pageNumber = 1, pageSize = 2) => {
    const url = `/saved-search/user-saved-searches/list?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const result = await axiosInstance.get(url);

    if (result?.data?.success) {
      const { data, paginationControl } = result.data;
      setTotalSearches(paginationControl.totalCount);
      setPagination(paginationControl);
      setSearches(data);

      return { data, paginationControl };
    }
  };

  const loadData = async (page: number) => {
    const result = await fetchData(page);
    console.log({ result });
  };

  useEffect(() => {
    loadData(1);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Saved Searches</h1>
      <p className="text-gray-500 mb-6">
        You have saved ({totalSearches}) searches
      </p>

      {searches.map((item: any) => (
        <SavedSearchCard search={item} key={item.id} />
      ))}

      {pagination?.currentPage && (
        <div className="w-full flex justify-center px-6 py-8">
          <DynamicPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNext={pagination.hasNext}
            hasPrevious={pagination.hasPrevious}
            onPageChange={loadData}
          />
        </div>
      )}
    </div>
  );
};
