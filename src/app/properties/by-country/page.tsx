
import { PropertiesByCountry } from "@/components/pages/Properties/Country";
import { Suspense } from "react";

export default function CountryPropertyPage() {
  return (
    <Suspense>
        <PropertiesByCountry/>
    </Suspense>
  );
}
