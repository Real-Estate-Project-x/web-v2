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

export const getLocalStorageField = (key: string) => JSON.parse(localStorage.getItem(key) as string);
export const getLocalStorageFieldRaw = (key: string) => {
  if(typeof window === 'undefined') return null;
  return localStorage.getItem(key)?.split('\"')?.[1];
}
export const deleteLocalStorageField = (key: string) =>
  localStorage.removeItem(key);

export const pickUserId = () => {
  const userInfo = decryptData(
    getLocalStorageField("userInfo"),
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


// const additionalCostSchema = z.object({
//   title: z.string().optional(), //.min(1,""),
//   price: z.number().optional() //.min(1,'0')
// });

// const propertySchema = z.object({
//   propertyTypeId: z.string().min(1, "Property type is required"),
//   title: z.string().min(3, "Title must be at least 3 characters").max(100),
//   address: z.string().min(5, "Address is required"),
//   upFor: z.enum(["SALE", "RENT"]),
//   propertyCategory: z.enum(["RESIDENTIAL", "COMMERCIAL"]),
//   description: z.string().min(10, "Description must be at least 10 characters").max(1000),
//   photoUrls: z.array(z.string().url()).min(1, "At least one photo is required"),
//   price: z.number().min(0, "Price must be positive"),
//   additionalCosts: z.array(additionalCostSchema),
//   paymentCoverageDuration: z.enum(["MONTHLY", "YEARLY", "ONE_TIME"]),
//   agencyId: z.string().min(1, "Agency ID is required"),
//   stateId: z.string().min(1, "State is required"),
//   sizeInSquareFeet: z.number().min(1, "Size is required"),
//   geoCoordinates: z.object({
//     latitude: z.number().min(-90).max(90),
//     longitude: z.number().min(-180).max(180),
//   }),
//   averageBroadbandSpeedInMegabytes: z.number().min(0),
//   videoUrl : z.array(z.string().url()).optional(),
//   architecturalPlanUrls: z.array(z.string().url()).optional(),
//   noOfBedrooms: z.number().min(1),
//   noOfToilets: z.number().min(1),
//   noOfKitchens: z.number().min(1),
//   threeDimensionalModelUrl: z.string().url().optional().or(z.literal("")),
//   hasLaundry: z.boolean(),
//   hasWifi: z.boolean(),
//   hasCarParking: z.boolean(),
//   hasKidsPlayArea: z.boolean(),
//   hasCctv: z.boolean(),
//   hasGym: z.boolean(),
//   isNewBuilding: z.boolean(),
// });


// const sampleProperty = {
//   additionalCosts:[]
// address:"1299 323 sdfiufiuew sidisifdds"
// agencyId:"5a1d6ffe-0036-4a89-9b46-0593e9e0da8c"
// architecturalPlanUrls:[]
// averageBroadbandSpeedInMegabytes:5
// description:"IQI eiiw weowoe riwoiiwe weoieiowe"
// geoCoordinates:{latitude: 0.492939, longitude: 0.23932932}
// hasCarParking:false
// hasCctv:false
// hasGym:true
// hasKidsPlayArea:false
// hasLaundry:true
// hasWifi:true
// isNewBuilding:true
// noOfBedrooms:5
// noOfKitchens:2
// noOfToilets:3
// paymentCoverageDuration:"YEARLY"
// photoUrls: ['https://ik.imagekit.io/37hskgspznp/uploads/9126a99c-ab5a-48b6-8d78-30164257eaf8_sLffcAGqrh.png', 'https://ik.imagekit.io/37hskgspznp/uploads/8a44e73f-520c-4552-ace5-a3279b012be3_r4AsnNidB.png']
// price:1000000
// propertyCategory:"RESIDENTIAL"
// propertyTypeId:"ad2f71a4-7cfb-4c2c-9f3d-cd2d8f88f10c"
// sizeInSquareFeet:3000
// stateId:"4f859a20-208e-4b3d-9bc9-49b23778ef63"
// threeDimensionalModelUrl:""
// title:"Modertiiww"
// upFor:"SALE"
// videoUrl:[]
// }