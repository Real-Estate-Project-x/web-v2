import { Suspense } from "react";
import { StatePropertyList } from "@/components/pages/Properties/State";

export default function StatePropertyPage() {
  return (
    <Suspense>
      <StatePropertyList />
    </Suspense>
  );
}
