import Cookies from 'js-cookie';

export function deleteCookie(key: string) {
  Cookies.remove(key);
}

export function setCookie(key: string, value: string) {
  Cookies.set(key, value);
}

export function getCookie(key: string) {
  return Cookies.get(key) as string;
}

export function handleLoggingOff () {
  deleteCookie('access_token');
  deleteCookie('refresh_token');
  window.location.href = '/login';
}