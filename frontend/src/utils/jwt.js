// src/utils/jwt.js
// Minimal JWT decode (no validation, just base64 decode payload)
export function decodeJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
