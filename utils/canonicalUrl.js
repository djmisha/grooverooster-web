/**
 * Generate canonical URL for SEO purposes
 * Always points to www.grooverooster.com as the preferred domain
 * @param {string} path - The path of the page (e.g., '/events/atlanta' or '/')
 * @returns {string} Full canonical URL
 */
export const getCanonicalUrl = (path = "") => {
  const baseUrl = "https://www.grooverooster.com";

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};
