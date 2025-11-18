
import AuthLayout from "@/components/layout/auth";
import LoginForm from "@/components/onboarding/login";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense>
      <AuthLayout>
        <LoginForm/>
      </AuthLayout>
    </Suspense>
  );
}
