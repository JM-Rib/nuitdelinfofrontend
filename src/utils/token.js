export function storeToken(token) {
  const expirationDate = new Date();
  const expirationTime = 3600 * 1000; // Set expiration time in milliseconds (e.g., 1 hour)
  expirationDate.setTime(expirationDate.getTime() + expirationTime);
  
  document.cookie = `token=${token};expires=${expirationDate.toUTCString()};path=/`;
}

export function removeToken() {
  document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
}

export function getToken() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('token=')) {
      return cookie.substring('token='.length, cookie.length);
    }
  }
  return null;
}