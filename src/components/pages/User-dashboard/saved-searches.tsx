import Link from "next/link";
import { DynamicPagination } from "@/components/shared/dynamic-pagination";
import SavedSearchCard from "@/components/shared/saved-search-card";

export const DashboardSavedSearch = () => {
  return (
    <>
      <SavedSearchCard />
      <SavedSearchCard />
    </>
  );
};
