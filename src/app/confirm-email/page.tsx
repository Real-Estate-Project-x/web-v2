
import AuthLayout from "@/components/layout/auth";
import ConfirmEmailForm from "@/components/onboarding/confirm-email";
import { Suspense } from "react";

export default function ConfirmEmail() {
  return (
    <Suspense>
      <AuthLayout>
        <ConfirmEmailForm/>
      </AuthLayout>
    </Suspense>
  );
}
