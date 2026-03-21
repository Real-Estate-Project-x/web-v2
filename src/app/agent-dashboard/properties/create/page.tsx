import { Suspense } from "react";
import { CreateProperty } from "@/components/Agency/components/Properties/create-property";
import AgentLayout from "@/components/Agency/layout";

export default function AgentCreatePropertyPage() {
  return (
    <Suspense>
      <AgentLayout>
        <CreateProperty />
      </AgentLayout>
    </Suspense>
  );
}
