import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  PropertyInterface,
  ViewPropertyInterface,
} from "../../utils/interfaces";
import { getLocalStorageField } from "../../utils/helpers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get IP address of current_user on site
 * @returns user ip_address
 */
// export const getUserIp = async () => {
//   const url = "https://api.ipify.org/?format=json";
//   const userIPAddress = await axios<any, { ip: string }>(url);
//   return userIPAddress.ip;
// };

export const getUserIp = async (): Promise<string> => {
  const url = "https://api.ipify.org/?format=json";
  const response = await axios.get<{ ip: string }>(url);
  return response.data.ip;
};

export const returnHeaders = (
  ip = "104.28.204.233",
  longitude = "7.520406",
  latitude = "6.412896"
) => {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "x-user-ip": ip,
    // "x-longitude": longitude,
    // "x-latitude": latitude,
  };
};

export function hasAmenities(data: Partial<PropertyInterface>): boolean {
  return Boolean(
    data?.hasWifi || data?.hasCctv || data?.hasLaundry || data?.hasGym
  );
}

export function hasFeatures(data: Partial<PropertyInterface>): boolean {
  return Boolean(
    data?.hasCarParking ||
      data?.hasKidsPlayArea ||
      data?.isPetFriendly ||
      data?.isNewBuilding
  );
}

export function isUserLoggedIn(): boolean {
  return !!getLocalStorageField("token");
}

export function reformatDate(date: string): string {
  const splitDate = date?.split("/");
  return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
}
