import { axiosInstance } from "@/lib/axios-interceptor";
import { deleteCookie } from "@/lib/helpers";
import { AxiosError } from "axios";
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

//export const getLocalStorageField = <T>(key: string) => JSON.parse(localStorage.getItem(key) as string) as T;
export const getLocalStorageField = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
};

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

// To be removed later
export const defaultImageUrls = (property: any) => {
  const imageUrls = [
    "https://blupodd.sirv.com/uploads/95fcba07-4a79-4dcd-b056-345343e8a7d5.jpeg",
    "https://blupodd.sirv.com/uploads/8b3a8c4c-4540-400e-baf8-1adb9e71bf50.jpeg",
    "https://blupodd.sirv.com/uploads/78eef01d-5b4b-4c56-ba35-cc775be751ba.jpeg",
    "https://blupodd.sirv.com/uploads/862f6ba6-63ca-4a82-9503-196078c8353f.jpeg",
    "https://blupodd.sirv.com/uploads/45b56385-afa7-4f72-b4d1-5240fd5fb46b.jpeg",
    "https://blupodd.sirv.com/uploads/baec6c7c-0647-4ee4-8521-acc2185eb3aa.jpeg",
    "https://blupodd.sirv.com/uploads/4a1f0a9b-9477-4b17-9e0e-b7f7dc48786e.jpeg",
  ];

  const getRandomImageUrl = () => {
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
  };

  for (const { image } of property.propertyImages) {
    if (String(image.url).includes("imagekit")) {
      image.url = getRandomImageUrl();
    }
  }
};

export const fetchAgencies = async (setAgencies: Function, toast: any) => {
  const url = `/agency/dropdown/agency-list/?fields=success,paginationControl,data(id,name,description)`;
  try {
    const response = await axiosInstance.get(url);
    if (response.data.success) {
      setAgencies(response.data.data);
    }
  } catch (error) {
    let message = "An error occurred";
    if (error instanceof AxiosError) {
      message = error.message;
    }
    toast(message, { description: JSON.stringify(error) });
    throw error;
  }
};

export const fetchPropertyTypes = async (setPropertyTypes: Function) => {
  const url = "/property-type";
  try {
    const response = await axiosInstance.get(url);
    if (response.data?.success) {
      const result = response.data;
      setPropertyTypes(result.data);

      return result;
    }
  } catch (error) {
    throw error;
  }
};
