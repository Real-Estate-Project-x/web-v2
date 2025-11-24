
import AuthLayout from "@/components/layout/auth";
import ProfileForm from "@/components/onboarding/profile-agent-signUp";
import { Suspense } from "react";

export default function AgentProfilePage() {
  return (
    <Suspense>
      <AuthLayout>
        <ProfileForm/>
      </AuthLayout>
    </Suspense>
  );
}
