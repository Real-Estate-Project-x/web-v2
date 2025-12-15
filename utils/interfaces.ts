import { ReactNode } from "react";

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

export interface TourFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
}

export interface CommentFormData {
  name: string;
  email: string;
  comment: string;
  rating: number;
}

export interface Comment {
  id: number;
  userName: string;
  date: string;
  text: string;
  rating: number;
}

export interface Amenity {
  id: number;
  name: string;
  icon: "wifi" | "gym" | "washing-machine";
}

export interface ArchitecturalDrawing {
  id: number;
  title: string;
  type: "image" | "document";
  url: string;
}

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

export interface ViewPropertyInterface {
  isViewed: boolean;
  property: Partial<PropertyInterface>;
  similarProperties: Partial<PropertyInterface>[];
}

//  const sampleInitialObject : ViewPropertyInterface = {
//   //write an initial object for the above interface
//   isViewed : false,
//   property : {
//     id: "",
//     title: "",
//     description: "",
//     address: "",
//     stateId: "",
//     agencyId: "",
//     postedByUserId: "",
//     propertyTypeId: "",
//     propertyType : {
//       id: "",
//       name: "",
//       status: false,
//       dateCreated: "",
//       dateUpdated: "",
//     },
//     propertyCategory: "",
//     upFor: "",
//     price: 0,
//     grandTotalPrice: 0,
//     additionalCosts: [],
//     paymentCoverageDuration: "",
//     sizeInSquareFeet: 0,
//     noOfBedrooms: 0,
//     noOfToilets: 0,
//     noOfKitchens: 0,
//     hasCarParking: false,
//     hasLaundry: false,
//     hasWifi: false,
//     hasCctv:false,
//     hasGym: false,
//     hasKidsPlayArea:false,
//     averageBroadbandSpeedInMegabytes: 0,
//     bluepoddRating: 0,
//     isPropertyBlocked: false,
//     isPropertyBoosted: false,
//     isPropertyTaken: false,
//     status: false,
//     dateCreated: "",
//     dateUpdated: "",
//     photoUrls: [],
//     videoUrl: "",
//     architecturalPlanUrls: [],
//     isNewBuilding : false,
//     threeDimensionalModelUrl: "",
//     geoCoordinates: {
//       latitude: 0,
//       longitude: 0,
//     },

//   },
//   similarProperties : []
// }

export interface PropertyInterface {
  id: string;
  title: string;
  slug: string;
  description: string;
  address: string;
  stateId: string;
  agencyId: string;
  postedByUserId: string;
  propertyTypeId: string;
  isBoosted?: boolean;
  propertyType: {
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
  additionalCosts: { title: string; amount: number }[];
  paymentCoverageDuration: string;
  sizeInSquareFeet: number;
  noOfBedrooms: number;
  noOfToilets: number;
  noOfKitchens: number;
  hasCarParking: boolean;
  hasLaundry: boolean;
  hasWifi: boolean;
  hasCctv: boolean;
  hasGym: boolean;
  hasKidsPlayArea: boolean;
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
  isNewBuilding: boolean;
  threeDimensionalModelUrl: string;
  geoCoordinates: {
    latitude: number;
    longitude: number;
  };
  similarProperties?: any[];
}

export interface LocationsInterface {
  propertyCount: number;
  state: {
    id: string;
    name: string;
    initials: string;
    capital: string;
    countryId: string;
    status: boolean;
    dateCreated: string;
    dateUpdated: string;
  };
}

export interface NavDataInterface {
  href: string;
  label: string | React.ReactNode;
  icon?: any;
}

export interface CommentInterface {
  id: string;
  dateCreated: string;
  text: string;
  name: string;
  email: string;
  comment: string;
  rating: number;
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
  agency: {
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
  propertyTypes: [
    {
      dateCreated: string;
      dateUpdated: string;
      id: string;
      name: string;
      status: boolean;
    }
  ];
  timeSinceJoined: string;
  totalReviewCount: number;
  viewingsCount: number;
}

export const AgentInitialObject = {
  agency: {
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
    whatsappNumber: "08034567890",
  },
  propertyTypes: [
    {
      dateCreated: "string",
      dateUpdated: "string",
      id: "",
      name: "string",
      status: true,
    },
  ],
  timeSinceJoined: "string",
  totalReviewCount: 0,
  viewingsCount: 0,
};

export interface SearchPropertyInterfaceType {
  label: string;
  property: {
    id: string;
    status: boolean;
    dateCreated: string;
    dateUpdated: string;
    slug: string;
    description: string;
    address: string;
    agencyId: string;
    architecturalPlanUrls: string[];
    averageBroadbandSpeedInMegabytes: number;
    bluepoddRating: number;
    geoCoordinates: {
      latitude: number;
      longitude: number;
    };
    grandTotalPrice: number;
    hasCarParking: boolean;
    hasCctv: boolean;
    hasGym: boolean;
    hasKidsPlayArea: boolean;
    hasLaundry: boolean;
    hasWifi: boolean;
    isNewBuilding: boolean;
    isPetFriendly: boolean;
    isPropertyBlocked: boolean;
    isPropertyBoosted: boolean;
    isPropertyTaken: boolean;
    noOfBedrooms: number;
    noOfKitchens: number;
    noOfToilets: number;
    paymentCoverageDuration: string;
    additionalCosts: { price: number; title: string }[];
    agency: {
      id: string;
      status: boolean;
      dateCreated: string;
      dateOfIncorporation: string;
      dateUpdated: string;
      description: string;
      address: string;
      email: string;
      logo: string;
      name: string;
      rating: number;
      rcNumber: string;
      agencyPhoneNumber: string;
      whatsappNumber: string;
      agencyCACDump: Record<string, any>;
      createdByUserId: string;
      isRegistered: boolean;
      inPersonViewingFee: number | null;
    };
    photoUrls: string[];
    postedByUser: {
      id: string;
      status: boolean;
      dateCreated: string;
      dateUpdated: string;
      address: string | null;
      appleRefreshToken: string | null;
      authProvider: string;
      deviceTokens: string[];
      email: string;
      firstName: string;
      formattedPhoneNumber: string;
      googleRefreshToken: string | null;
      lastName: string;
      phoneNumber: string;
      profileImage: string;
      roleId: string;
      thirdPartyUserId: string | null;
      verificationCode: string | null;
    };
    postedByUserId: string;
    price: number;
    propertyCategory: string;
    propertyType: {
      id: string;
      status: boolean;
      dateCreated: string;
      dateUpdated: string;
      name: string;
      tag: string;
    };
    propertyTypeId: string;
    sizeInSquareFeet: number;
    state: {
      id: string;
      status: boolean;
      dateCreated: string;
      dateUpdated: string;
      capital: string;
      countryId: string;
      initials: string;
      name: string;
    };
    stateId: string;
    threeDimensionalModelUrl: string;
    title: string;
    upFor: string;
    videoUrl: string;
  };
  propertyId: string;
}

export interface AgentDatabaseInterface {
  id: string;
  title: string;
  description: string;
  address: string;
  stateId: string;
  state: {
    id: string;
    name: string;
    initials: string;
    capital: string;
    countryId: string;
    status: boolean;
    dateCreated: string;
    dateUpdated: string;
  };
  agencyId: string;
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
    agencyCACDump: Record<string, any>;
    status: boolean;
    dateCreated: string;
    dateUpdated: string;
    createdByUserId: string;
    inPersonViewingFee: number | null;
  };
  postedByUserId: string;
  postedByUser: {
    id: string;
    status: boolean;
    dateCreated: string;
    dateUpdated: string;
    roleId: string;
    address?: string | null;
    appleRefreshToken?: string | null;
    authProvider?: string;
    deviceTokens?: string[];
    email?: string;
    firstName?: string;
    formattedPhoneNumber?: string;
    googleRefreshToken?: string | null;
    lastName?: string;
    phoneNumber?: string;
    profileImage?: string;
    thirdPartyUserId?: string | null;
    verificationCode?: string | null;
  };
  propertyTypeId: string;
  propertyType: {
    id: string;
    name: string;
    status: boolean;
    dateCreated: string;
    dateUpdated: string;
    tag: string;
  };
  propertyCategory: string;
  upFor: string;
  price: number;
  slug: string;
  grandTotalPrice: number;
  additionalCosts: { price: number; title: string }[];
  paymentCoverageDuration: string;
  sizeInSquareFeet: number;
  noOfBedrooms: number;
  noOfToilets: number;
  noOfKitchens: number;
  hasCarParking: boolean;
  hasLaundry: boolean;
  hasWifi: boolean;
  hasCctv: boolean;
  hasGym: boolean;
  hasKidsPlayArea: boolean;
  isNewBuilding: boolean;
  isPetFriendly: boolean;
  isPropertyBlocked: boolean;
  isPropertyBoosted: boolean;
  isPropertyTaken: boolean;
  averageBroadbandSpeedInMegabytes: number;
  bluepoddRating: number;
  status: boolean;
  dateCreated: string;
  dateUpdated: string;
  photoUrls: string[];
  videoUrl: string;
  architecturalPlanUrls: string[];
  threeDimensionalModelUrl: string;
  geoCoordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface PropertyTypesInterface {
  dateCreated: string;
  dateUpdated: string;
  id: string;
  name: string;
  status: boolean;
  tag: string;
}

export interface AgentUsersInterface {
  activeSubAgents: any[];
  customers: any[];
  rating: number;
  totalCustomers: number;
  totalListings: number;
  totalSubAgents: number;
}
// export const SearchPropertyInterface: SearchPropertyInterfaceType = {
//   label: "Search Result",
//   property: {
//     id: "692c5374-e382-4b89-97bd-a393a8e1a342",
//     status: true,
//     dateCreated: "2025-08-12T11:13:46.219Z",
//     dateUpdated: "2025-08-12T11:13:46.219Z",
//     description: "affordable 1 bedroom mini flat ideal for first-time buyers",
//     address: "17 sabon gari market road, sabon gari, kaduna",
//     agencyId: "8b6c7c37-72b5-4db8-9184-214f32b8b68d",
//     architecturalPlanUrls: ["https://www.google.com"],
//     averageBroadbandSpeedInMegabytes: 320,
//     bluepoddRating: 0,
//     geoCoordinates: {
//       latitude: 8.882612179920129,
//       longitude: 11.378938077009188,
//     },
//     grandTotalPrice: 0,
//     hasCarParking: false,
//     hasCctv: false,
//     hasGym: false,
//     hasKidsPlayArea: false,
//     hasLaundry: true,
//     hasWifi: true,
//     isNewBuilding: false,
//     isPetFriendly: false,
//     isPropertyBlocked: false,
//     isPropertyBoosted: false,
//     isPropertyTaken: false,
//     noOfBedrooms: 1,
//     noOfKitchens: 1,
//     noOfToilets: 1,
//     paymentCoverageDuration: "YEARLY",
//     additionalCosts: [
//       { price: 35000, title: "Property verification" },
//       { price: 20000, title: "Title search" },
//     ],
//   },
//   agency: {
//     id: "8b6c7c37-72b5-4db8-9184-214f32b8b68d",
//     status: true,
//     dateCreated: "2025-07-28T15:04:47.839Z",
//     dateOfIncorporation: "2025-07-28",
//     dateUpdated: "2025-07-28T15:04:47.839Z",
//     description: "This is a test description",
//     address: "no. 50 alatunji road",
//     email: "j.oluwa@example.com",
//     logo: "https://cdn.pixabay.com/photo/2025/03/06/17/45/duck-9451249_1280.jpg",
//     name: "oluwafemi's agency",
//     rating: 0,
//     rcNumber: "1234567",
//     agencyPhoneNumber: "08034567890",
//     whatsappNumber: "08034567890",
//     agencyCACDump: {},
//     createdByUserId: "64e06d75-61cb-4069-bf8d-c59b3552d95e",
//     isRegistered: true,
//     inPersonViewingFee: null,
//   },
// };

interface CountryInterface {
  id: string;
  code: string;
  name: string;
  status: boolean;
  isSignupEnabled: boolean;
  dateCreated: string;
  dateUpdated: string;
  createdByAdminUserId: string | null;
  updatedByAdminUserId: string | null;
}

export interface CountryStatesInterface {
  capital: string;
  country: CountryInterface;
  countryId: string;
  dateCreated: string;
  dateUpdated: string;
  id: string;
  initials: string;
  name: string;
  status: boolean;
}

export interface AgencyInterface {
  address: string;
  createdByUser: {
    address: string | null;
    appleRefreshToken: string | null;
    authProvider: string;
    dateCreated: string;
    dateUpdated: string;
    deviceTokens: any[];
    email: string;
    firstName: string;
    formattedPhoneNumber: string | null;
    googleRefreshToken: string | null;
    id: string;
    lastName: string;
    phoneNumber: string;
    profileImage: string;
    roleId: string;
    status: boolean;
    thirdPartyUserId: string | null;
    verificationCode: string | null;
  };
  agencyCACDump: {
    data: {
      affiliates: number;
      branchAddress: string;
      city: string;
      classification: string;
      companyEmail: string;
      companyName: string;
      companyType: string;
      headOfficeAddress: string;
      lga: string;
      rcNumber: string | null;
      registrationDate: string;
      shareCapital: string;
      shareCapitalInWords: string;
      state: string;
      status: string;
    };
    status: string;
  };
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
  properties: PropertyInterface[];
  rating: number;
  rcNumber: string;
  status: boolean;
  whatsappNumber: string;
  agencyPhoneNumber: string;
}
