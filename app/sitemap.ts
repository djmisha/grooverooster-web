import { MetadataRoute } from "next";
import { getLocations } from "../utils/getLocations";
import { allArtists } from "../utils/getArtists";

/**
 * Generates the sitemap for the website with all locations and artists
 * @returns {MetadataRoute.Sitemap} Sitemap array with all URLs
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const URL = "https://www.grooverooster.com";
  const locations = getLocations();
  const artists = allArtists;

  const routes: MetadataRoute.Sitemap = [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Add location pages
  const locationRoutes = locations.map((location: any) => ({
    url: `${URL}/events/${location.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Add artist pages
  const artistRoutes = artists.map((artist: any) => ({
    url: `${URL}/artist/${artist.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...locationRoutes, ...artistRoutes];
}
