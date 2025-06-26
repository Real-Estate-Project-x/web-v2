import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get IP address of current_user on site
 * @returns user ip_address
 */
export const getUserIp = async () => {
  const url = "https://api.ipify.org/?format=json";
  const userIPAddress = await axios<any, { ip: string }>(url);
  return userIPAddress.ip;
};
