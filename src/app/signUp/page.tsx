
import AuthLayout from "@/components/layout/auth";
import SignUpForm from "@/components/onboarding/signUp";

export default function Home() {
  return (
    <AuthLayout>
      <SignUpForm/>
    </AuthLayout>
  );
}
