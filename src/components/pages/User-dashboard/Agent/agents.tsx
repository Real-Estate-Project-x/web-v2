import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from "../../../../../utils/interfaces";



export const DashboardAgents = ({ onSelectAgent }: { onSelectAgent: (agent: Agent) => void }) => {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Select Your Agent</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "John Smith",
              role: "Senior Real Estate Agent",
              experience: "10+ years",
              properties: "200+ sold",
              image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
            },
            {
              name: "Sarah Johnson",
              role: "Luxury Property Specialist",
              experience: "8 years",
              properties: "150+ sold",
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
            },
            {
              name: "Michael Brown",
              role: "Commercial Property Expert",
              experience: "12 years",
              properties: "300+ sold",
              image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
            }
          ].map((agent) => (
            <Card key={agent.name} className=" hover:shadow-lg transition-shadow h-96 p-4">
              <div className="flex justify-center">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-44 h-44 object-cover rounded-full"
                />
              </div>
              <CardHeader className="mb-0">
                <CardTitle>{agent.name}</CardTitle>
                {/* <CardDescription>{agent.role}</CardDescription> */}
              </CardHeader>
              <CardContent className="">
                <div className="space-y-2 text-sm">
                  <p>Experience: {agent.experience}</p>
                  <p>Properties: {agent.properties}</p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button className="flex-1 hover:bg-[#0253CC] bg-[#1E3A8A]" onClick={() => onSelectAgent(agent)}>
                  Select Agent
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  
 