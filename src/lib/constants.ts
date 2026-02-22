import { getLocalStorageFieldRaw } from "../../utils/helpers";

export const AgencyId = getLocalStorageFieldRaw("agentId");

export const NAIRA_SIGN = "₦";

export enum BLUPODD {
  EMAIL = "blupodd@gmail.co",
  PHONE = "090-293-23843",
}

export enum PropertyViewingFilter {
  ALL = "ALL",
  PAST = "PAST",
  TODAY = "TODAY",
  UPCOMING = "UPCOMING",
}

export enum ViewingMedium {
  IN_PERSON = "IN_PERSON",
  VIRTUAL = "VIRTUAL",
}

export enum PropertyUpFor {
  RENT = "RENT",
  SALE = "SALE",
}
