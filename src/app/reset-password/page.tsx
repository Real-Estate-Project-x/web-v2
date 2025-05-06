
import AuthLayout from "@/components/layout/auth";
import ResetPasswordForm from "@/components/onboarding/reset-password";

export default function Home() {
  return (
    <AuthLayout>
      <ResetPasswordForm/>
    </AuthLayout>
  );
}
