import { MetadataRoute } from "next";
import { getLocations } from "@/utils/getLocations";

/**
 * Generates the sitemap for the website with all locations
 * @returns {MetadataRoute.Sitemap} Sitemap array with all URLs
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const URL = "https://www.grooverooster.com";
  const locations = getLocations();

  const routes: MetadataRoute.Sitemap = [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${URL}/cities`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${URL}/states`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${URL}/artists`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Add location pages
  const locationRoutes = locations.map((location: any) => ({
    url: `${URL}/events/${location.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...routes, ...locationRoutes];
}
