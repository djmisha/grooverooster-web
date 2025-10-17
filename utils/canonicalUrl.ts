/**
 * Generate canonical URL for SEO purposes
 * Always points to www.grooverooster.com as the preferred domain
 * @param path - The path of the page (e.g., '/events/atlanta' or '/')
 * @returns Full canonical URL
 */
export const getCanonicalUrl = (path: string = ""): string => {
  const baseUrl = "https://www.grooverooster.com";

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};
