import { deleteCookie } from "@/lib/helpers";
import { AES, enc } from "crypto-js";

export const formatPrice = (price: number): string => {
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });
  const NGN = formatter.format(price).split(".")[0];
  // setCookie('ogAmount',price?.toString());
  return NGN;
};

export function validatePassword(password: string): boolean {
  //password must be at least 8 characters, must contain alphabets and special characters
  //const pattern =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
  const pattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return pattern.test(password);
}

export function validatePhoneNumber(numberString: string): boolean {
  if (!numberString) return false;

  if (
    ["080", "081", "090", "070", "071", "091"].includes(
      numberString.substring(0, 3)
    ) &&
    /^\d+$/.test(numberString) &&
    numberString.length === 11
  ) {
    return true;
  }
  return false;
}
export function validateEmail(email: string): boolean {
  const re = /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
  return re.test(email.toLowerCase());
}

export const encryptData = <T>(rawData: T, encryptionKey: string): string => {
  let data: any = rawData;
  if (typeof rawData !== "string") {
    data = JSON.stringify(rawData);
  }
  return AES.encrypt(data, encryptionKey).toString();
};

export const decryptData = (
  encryptedData: string,
  encryptionKey: string
): string => AES.decrypt(encryptedData, encryptionKey).toString(enc.Utf8);

export const convertDateCreatedToGetNumberOfDays = (dateCreated: string) => {
  const createdDate = new Date(dateCreated);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - createdDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
  return daysDifference;
};

export const setLocalStorageField = <T>(key: string, data: T) =>
  localStorage.setItem(key, JSON.stringify(data));

export const getLocalStorageField = <T>(key: string) =>
  JSON.parse(localStorage.getItem(key) as string) as T;

export const getLocalStorageFieldRaw = (key: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key)?.split('"')?.[1];
};

export const deleteLocalStorageField = (key: string) =>
  localStorage.removeItem(key);

export const pickUserId = () => {
  const localUserInfo = getLocalStorageField<any>("userInfo");
  if (!localUserInfo) {
    return;
  }
  const userInfo = decryptData(
    localUserInfo,
    String(process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_KEY)
  );
  return JSON.parse(userInfo).userId;
};

export const checkForRequiredFields = (
  requiredFields: string[],
  requestPayload: Object
): { missingFields: string[]; errorMessage: string } | undefined => {
  const missingFields = requiredFields.filter(
    (field: string) =>
      Object.keys(requestPayload).indexOf(field) < 0 ||
      Object.values(requestPayload)[
        Object.keys(requestPayload).indexOf(field)
      ] === "" ||
      !Object.values(requestPayload)[Object.keys(requestPayload).indexOf(field)]
  );
  if (missingFields.length) {
    return {
      missingFields,
      errorMessage: `Missing required field(s): '${[...missingFields]}'`,
    };
  }
};

export const formatPrettyDateTime = (dateInput: Date | string) => {
  const date = new Date(dateInput);

  const day = date.getDate();
  const year = date.getFullYear();

  const weekday = date.toLocaleString("en-GB", { weekday: "long" });
  const month = date.toLocaleString("en-GB", { month: "long" });

  const time = date.toLocaleString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${weekday}, ${day}${getOrdinal(day)} ${month} · ${time}`;
};

export const getOrdinal = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const parseDDMMYYYY = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const removeStoredKeys = () => {
  // remove items from short_term storage
  deleteLocalStorageField("token");
  deleteLocalStorageField("userInfo");
  deleteCookie("access_token");
};

export const getBrowserName = () => {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    return "Chrome";
  } else if (userAgent.includes("Firefox")) {
    return "Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    return "Safari";
  } else if (userAgent.includes("Edg")) {
    return "Edge";
  } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
    return "Opera";
  } else {
    return "Unknown";
  }
};

export const cleanObject = (obj: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {};

  Object.entries(obj).forEach(([key, value]) => {
    // Remove empty string, undefined, or null
    if (value === "" || value === undefined || value === null) {
      return;
    }

    // Handle nested objects
    if (typeof value === "object" && !Array.isArray(value)) {
      const nested = cleanObject(value);

      // Only keep object if it has valid keys
      if (Object.keys(nested).length > 0) {
        cleaned[key] = nested;
      }

      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
};
