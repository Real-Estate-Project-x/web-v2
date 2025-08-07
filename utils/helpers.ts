import AES from "crypto-js/aes";

export const formatPrice = (price : number) : string => {
  const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
  });
  const NGN = formatter.format(price).split('.')[0];
 // setCookie('ogAmount',price?.toString());
  return NGN;
}

  export function validatePassword(password : string) : boolean{
    //password must be at least 8 characters, must contain alphabets and special characters 
    //const pattern =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/ ;
    return pattern.test(password);
  }

   export function validatePhoneNumber(numberString : string) : boolean{
    if(!numberString) return false;
    
    if((['080', '081', '090', '070', '071', '091'].includes(numberString.substring(0,3)))
    && (/^\d+$/.test(numberString)) 
  && (numberString.length === 11)){
      return true;
    }
    return false;
  }
  export function validateEmail(email: string): boolean {
    const re =/^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
    return re.test(email.toLowerCase());
}

export const encryptData = <T>(rawData: T, encryptionKey: string): string => {
  let data: any = rawData;
  if (typeof rawData !== 'string') {
    data = JSON.stringify(rawData);
  }
  return AES.encrypt(data, encryptionKey).toString();
};