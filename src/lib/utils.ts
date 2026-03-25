import axios from "axios";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import {
  PropertyInterface,
  ViewPropertyInterface,
} from "../../utils/interfaces";
import { getLocalStorageField } from "../../utils/helpers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ipCache = {
  value: null as string | null,
  promise: null as Promise<string> | null, // ← prevents parallel calls during first fetch
};

export async function getUserIp(): Promise<string> {
  // Return cached value immediately
  if (ipCache.value) return ipCache.value;

  // If a fetch is already in-flight, reuse it instead of making a new call
  if (!ipCache.promise) {
    ipCache.promise = axios
      .get("https://api.ipify.org?format=json")
      .then(({ data }) => {
        ipCache.value = data.ip;
        return data.ip;
      })
      .catch((err) => {
        ipCache.promise = null; // reset so it can retry on failure
        throw err;
      });
  }

  return ipCache.promise;
}

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

export const isUserLoggedIn = (): boolean => {
  return !!getLocalStorageField("token");
};

export function reformatDate(date: string): string {
  const splitDate = date?.split("/");
  return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
}

export const getPropertyType = (
  propertyTypeId: string,
  propertyTypes: any[]
) => {
  if (!propertyTypes.length) return;

  return propertyTypes.find(({ id }) => id === propertyTypeId);
};

export const timeAgo = (inputDate: string | Date): string => {
  const now = new Date();
  const date = new Date(inputDate);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { name: "year", seconds: 60 * 60 * 24 * 365 },
    { name: "month", seconds: 60 * 60 * 24 * 30 },
    { name: "week", seconds: 60 * 60 * 24 * 7 },
    { name: "day", seconds: 60 * 60 * 24 },
    { name: "hour", seconds: 60 * 60 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds);
    if (value >= 1) {
      return `${value} ${unit.name}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

export const sortBy = <T, K extends keyof T>(
  data: T[],
  order: "asc" | "desc",
  key: K
): T[] => {
  console.log({ key, order });
  return [...data].sort((a, b) => {
    const aTime = new Date(a[key] as unknown as string | Date).getTime();
    const bTime = new Date(b[key] as unknown as string | Date).getTime();

    return order === "desc" ? bTime - aTime : aTime - bTime;
  });
};
