
import AuthLayout from "@/components/layout/auth";
import ResetPasswordForm from "@/components/onboarding/reset-password";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <AuthLayout>
        <ResetPasswordForm/>
      </AuthLayout>
    </Suspense>
  );
}
