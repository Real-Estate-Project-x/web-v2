import AgencyUsersView from "@/components/Agent/components/Agency-Users"; // Make sure this path is correct


export default function Agent() {
  return (
    <AgencyUsersView searchTerm="john" sortBy="asc" currentPage={1}/>
  );
}
