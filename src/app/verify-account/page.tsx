import { Suspense } from "react";
import AuthLayout from "@/components/layout/auth";
import VerifyAccountForm from "@/components/onboarding/verify-account";

export default function VerifyAccount() {
  return (
    <Suspense>
      <AuthLayout>
        <VerifyAccountForm />
      </AuthLayout>
    </Suspense>
  );
}
