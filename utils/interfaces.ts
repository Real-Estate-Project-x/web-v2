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

export interface TourFormData{
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
};

export interface CommentFormData{
  name: string;
  email: string;
  comment: string;
  rating: number;
};

export interface Comment{
  id: number;
  userName: string;
  date: string;
  text: string;
  rating: number;
};

export interface Amenity{
  id: number;
  name: string;
  icon: "wifi" | "gym" | "washing-machine";
};

export interface ArchitecturalDrawing{
  id: number;
  title: string;
  type: "image" | "document";
  url: string;
};