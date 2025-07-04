
import { StatePropertyList } from "@/components/pages/Properties/State";
import { Suspense } from "react";

export default function StatePropertyPage() {
  return (
    <Suspense>
        <StatePropertyList/>
    </Suspense>
  );
}
