import PropertyDetails from "@/components/pages/Properties/view-property";
import { Suspense } from "react";

export default function PropertiesPage() {
  return (
   <Suspense> <PropertyDetails/> </Suspense>
  );
}
