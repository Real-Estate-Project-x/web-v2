
import { SelectAccountTypeOnboarding } from "@/components/onboarding/select-account";
import { Suspense } from "react";

export default function SelectAccountPage() {
  return (
    <Suspense>
        <SelectAccountTypeOnboarding/>
    </Suspense>
  );
}
