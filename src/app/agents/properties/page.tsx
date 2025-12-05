import AgentProperties from "@/components/pages/Agents/agent-properties";
import { Suspense } from "react";


export default function AgentsPropertiesPage() {
  return (
    <Suspense>
        <AgentProperties/>
    </Suspense>
  );
}
