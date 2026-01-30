import Cookies from "js-cookie";

export function deleteCookie(key: string) {
  Cookies.remove(key);
}

export function setCookie(key: string, value: string) {
  Cookies.set(key, value);
}

export function getCookie(key: string) {
  return Cookies.get(key) as string;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}

export function handleLoggingOff() {
  deleteCookie("access_token");
  deleteCookie("refresh_token");
  window.location.href = "/login";
}

export function getUserGeolocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}
