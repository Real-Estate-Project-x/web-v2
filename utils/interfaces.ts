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

export interface TopAgentInterface {
  agency: {
    id: string;
    name: string;
    description: string;
    address: string;
    email: string;
    logo: string;
    rcNumber: string;
    dateOfIncorporation: string;
    agencyPhoneNumber: string;
    whatsappNumber: string;
    isRegistered: boolean;
    rating: number;
    properties: any[]; // You can replace 'any' with a more specific type if available
    agencyCACDump: Record<string, any>;
    status: boolean;
    dateCreated: string;
    dateUpdated: string;
    createdByUserId: string;
  };

  propertyCount: number;
  tags: string[];
}


export interface PropertyInterface {
  id: string;
  title: string;
  description: string;
  address: string;
  stateId: string;
  agencyId: string;
  postedByUserId: string;
  propertyTypeId: string;
  propertyType : {
    id: string;
    name: string;
    status: boolean;
    dateCreated: string;
    dateUpdated: string;
  };
  propertyCategory: string;
  upFor: string;
  price: number;
  grandTotalPrice: number;
  additionalCosts: { name: string; amount: number }[];
  paymentCoverageDuration: string;
  sizeInSquareFeet: number;
  noOfBedrooms: number;
  noOfToilets: number;
  noOfKitchens: number;
  hasCarParking: boolean;
  hasLaundry: boolean;
  hasWifi: boolean;
  hasCctv:boolean;
  hasGym: boolean;
  hasKidsPlayArea:boolean;
  averageBroadbandSpeedInMegabytes: number;
  bluepoddRating: number;
  isPropertyBlocked: boolean;
  isPropertyBoosted: boolean;
  isPropertyTaken: boolean;
  status: boolean;
  dateCreated: string;
  dateUpdated: string;
  photoUrls: string[];
  videoUrl: string;
  architecturalPlanUrls: string[];
  isNewBuilding : boolean;
  threeDimensionalModelUrl: string;
  geoCoordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface LocationsInterface {
  propertyCount: number;
  state : {
    id: string;
    name: string;
    initials: string;
    capital: string;
    countryId: string;
    status: boolean;
    dateCreated: string;
    dateUpdated: string;
  }
}

export interface NavDataInterface{
  href: string;
  label: string | React.ReactNode;
} 

export interface PaginationDataInterface {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  success: boolean;
}

export interface AgentInterface {
  agency : {
  address: string;
  agencyCACDump: Record<string, any>;
  agencyPhoneNumber: string;
  createdByUserId: string;
  dateCreated: string;
  dateOfIncorporation: string;
  dateUpdated: string;
  description: string;
  email: string;
  id: string;
  isRegistered: boolean;
  logo: string;
  name: string;
  rating: number;
  rcNumber: string;
  status: boolean;
  whatsappNumber: string;
  };
  propertyTypes : [{
    dateCreated:string;
    dateUpdated:string;
    id:string;
    name:string;
    status:boolean;
  }];
  timeSinceJoined:string;
  totalReviewCount:number;
  viewingsCount:number;

}

export const AgentInitialObject = {
  agency : {
  address: "no. 50 alatunji road",
  agencyCACDump: {},
  agencyPhoneNumber: "08034567890",
  createdByUserId: "64e06d75-61cb-4069-bf8d-c59b3552d95e",
  dateCreated: "2025-07-21T13:36:28.318Z",
  dateOfIncorporation: "2025-07-21",
  dateUpdated: "2025-07-21T13:36:28.318Z",
  description: "This is a test description",
  email: "j.oluwa@example.com",
  id: "8b6c7c37-72b5-4db8-9184-214f32b8b68d",
  isRegistered: true,
  logo: "https://cdn.pixabay.com/photo/2025/03/06/17/45/duck-9451249_1280.jpg",
  name: "oluwafemi's agency",
  rating: 0,
  rcNumber: "1234567",
  status: true,
  whatsappNumber: "08034567890"
  },
  propertyTypes : [{
    dateCreated:"string",
    dateUpdated:"string",
    id:"",
    name:"string",
    status: true
  }],
  timeSinceJoined:"string",
  totalReviewCount:0,
  viewingsCount:0

};