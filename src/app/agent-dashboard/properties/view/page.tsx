import AgentPropertyDetailPage from "@/components/Agency/components/Properties/agent-property-view";
import AgentLayout from "@/components/Agency/layout";
import { Suspense } from "react";


export default function AgentPropertiesPage() {
  return (
    <Suspense>
        <AgentLayout>
            <AgentPropertyDetailPage/>
        </AgentLayout>
    </Suspense>
  );
}
