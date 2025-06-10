
import AgentProfile from "@/components/Agent/components/Agent-profile/profile";
import { Suspense } from "react";


export default function AgentProfilePage() {
  return (
    <Suspense>
        <AgentProfile/>
    </Suspense>

  );
}
