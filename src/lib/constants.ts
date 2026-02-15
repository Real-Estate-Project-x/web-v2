import { getLocalStorageFieldRaw } from "../../utils/helpers";

export const AgencyId = getLocalStorageFieldRaw("agentId");

export const NAIRA_SIGN = "₦";

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
