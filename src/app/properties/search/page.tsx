import SearchResults from "@/components/pages/Search-properties";
import { Suspense } from "react";

export default function PropertiesPage() {
  return (
    <Suspense>
      <SearchResults/>
   </Suspense>
  );
}

