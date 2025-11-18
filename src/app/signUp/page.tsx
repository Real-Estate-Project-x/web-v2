
import AuthLayout from "@/components/layout/auth";
import SignUpForm from "@/components/onboarding/signUp";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <AuthLayout>
        <SignUpForm/>
      </AuthLayout>
    </Suspense>
  );
}
