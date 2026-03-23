import { Suspense } from "react";
import AgentLayout from "@/components/Agency/layout";
import { EditProperty } from "@/components/Agency/components/Properties/edit-property";

export default function AgentEditPropertyPage() {
  return (
    <Suspense>
      <AgentLayout>
        <EditProperty />
      </AgentLayout>
    </Suspense>
  );
}
