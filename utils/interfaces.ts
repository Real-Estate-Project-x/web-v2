export interface Agent {
    name: string;
    role: string;
    experience: string;
    properties: string;
    image: string;
  }
  
export interface Message {
    id: string;
    agentName: string;
    content: string;
    timestamp: string;
    isFromAgent: boolean;
    }

export interface Property {
  id: number;
  address: string;
  price: string;
  beds: number;
  baths: number;
  status: "Available" | "Pending" | "Sold";
}