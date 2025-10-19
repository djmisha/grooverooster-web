/**
 * Cookie utility functions for managing user location preferences
 * with enhanced security flags
 */

/**
 * Cookie options interface for better type safety
 */
interface CookieOptions {
  days?: number;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  path?: string;
}

/**
 * Delete a cookie by name
 * @param name - Cookie name
 */
export const deleteCookie = (name: string): void => {
  try {
    // Set cookie with past expiration date to delete it
    // Include security flags for consistency
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Strict`;
  } catch (error) {
    console.error("Error deleting cookie:", error);
  }
};

/**
 * Set a cookie with specified name, value, and security options
 * @param name - Cookie name
 * @param value - Cookie value (will be JSON stringified if object)
 * @param options - Cookie options (days, secure, sameSite, path)
 */
export const setCookie = (
  name: string,
  value: any,
  options: CookieOptions = {}
): void => {
  try {
    if (value === null || value === undefined) {
      deleteCookie(name);
      return;
    }

    // Default options with security best practices
    const {
      days = 30,
      secure = true, // Default to Secure in production
      sameSite = "Strict", // Default to Strict for maximum security
      path = "/",
    } = options;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    const cookieValue =
      typeof value === "object" ? JSON.stringify(value) : value;

    // Build cookie string with security flags
    const cookieParts = [
      `${name}=${encodeURIComponent(cookieValue)}`,
      `expires=${expires.toUTCString()}`,
      `path=${path}`,
      `SameSite=${sameSite}`,
    ];

    // Add Secure flag if enabled (should be true in production)
    // Note: Secure flag requires HTTPS
    if (
      secure &&
      typeof window !== "undefined" &&
      window.location.protocol === "https:"
    ) {
      cookieParts.push("Secure");
    }

    document.cookie = cookieParts.join(";");
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
};

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): any => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
};

/**
 * Check if cookies are enabled in the browser
 * @returns True if cookies are enabled
 */
export const areCookiesEnabled = (): boolean => {
  try {
    // Use minimal options for the test cookie
    setCookie("test", "test", { days: 1, secure: false, sameSite: "Lax" });
    const result = getCookie("test") === "test";
    deleteCookie("test");
    return result;
  } catch (error) {
    return false;
  }
};
