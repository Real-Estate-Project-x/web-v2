import AgencyUsersView from "@/components/Agency/components/Agency-Users"; // Make sure this path is correct
import AgentLayout from "@/components/Agency/layout";


export default function AgentsPage() {
  return (
    <AgentLayout>
      <AgencyUsersView searchTerm="john" sortBy="asc" currentPage={1}/>
    </AgentLayout>
  );
}
