/**
 * Utility for making authenticated server-side API calls
 * This helper automatically adds the internal server token to API requests
 */

/**
 * Make an authenticated API call from server-side code
 */
export async function authenticatedFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
    "User-Agent": "NextJS-Internal-Client",
  };

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API call failed: ${response.status} - ${errorData}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Authenticated fetch failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Make an authenticated GET request
 */
export async function authenticatedGet<T = any>(endpoint: string): Promise<T> {
  return authenticatedFetch<T>(endpoint, { method: "GET" });
}

/**
 * Make an authenticated POST request
 */
export async function authenticatedPost<T = any>(
  endpoint: string,
  data: any
): Promise<T> {
  return authenticatedFetch<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Make an authenticated PUT request
 */
export async function authenticatedPut<T = any>(
  endpoint: string,
  data: any
): Promise<T> {
  return authenticatedFetch<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
