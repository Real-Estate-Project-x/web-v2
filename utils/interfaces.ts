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

export interface AgentInterface {
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
  architecturalPlanUrl: string[];
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