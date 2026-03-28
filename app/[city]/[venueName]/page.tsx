import { Metadata, Viewport } from "next";
import Layout from "@/components/layout";
import { getVenueData } from "@/utils/getVenues";
import ClientNavigationBar from "@/app/[city]/[venueName]/ClientNavigationBar";
import { getCanonicalUrl } from "@/utils/canonicalUrl";

interface VenuePageProps {
  params: Promise<{ city: string; venueName: string }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

/**
 * Format a URL parameter name for display (replace hyphens with spaces, capitalize each word)
 */
const formatName = (name: string) =>
  name
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

/**
 * Generate metadata for the venue page
 */
export async function generateMetadata({
  params,
}: VenuePageProps): Promise<Metadata> {
  const { city, venueName } = await params;

  // Decode and format names for display
  const decodedVenueName = decodeURIComponent(venueName);
  const decodedCity = decodeURIComponent(city);

  const formattedVenueName = formatName(decodedVenueName);
  const formattedCity = formatName(decodedCity);

  const title = `${formattedVenueName} - Events & Shows in ${formattedCity}`;
  const description = `Upcoming events, shows, and concerts at ${formattedVenueName} in ${formattedCity}. Find tickets and event information.`;

  return {
    title,
    description,
  };
}

/**
 * Venue page component displays venue information and events
 * Server-side rendered for optimal SEO and performance
 */
export default async function VenuePage({ params }: VenuePageProps) {
  const { city, venueName } = await params;

  // Decode the URL parameters
  const decodedVenueName = decodeURIComponent(venueName);
  const decodedCity = decodeURIComponent(city);

  // Format the venue name and city for display
  const formattedVenueName = formatName(decodedVenueName);
  const formattedCity = formatName(decodedCity);

  // Try to fetch venue data
  let venueData = null;
  try {
    venueData = await getVenueData(decodedVenueName);
  } catch (error) {
    console.error("Error fetching venue data:", error);
    // Continue with null venueData - we'll show basic info from URL params
  }

  const canonicalUrl = getCanonicalUrl(`/${city}/${venueName}`);

  return (
    <Layout home={false} canonicalUrl={canonicalUrl}>
      <ClientNavigationBar />
      <div className="text-center pt-10 px-4">
        <h1 className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px]">
          {formattedVenueName}
        </h1>
        <p className="text-gray-600 mt-2">{formattedCity}</p>

        {venueData && (
          <div className="mt-6">
            {venueData.address && (
              <p className="text-gray-700">{venueData.address}</p>
            )}
            {venueData.url && (
              <a
                href={venueData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink hover:underline mt-2 inline-block"
              >
                Visit Website
              </a>
            )}
          </div>
        )}

        <div className="mt-8">
          <h2 className="font-normal text-lg text-blue md:text-xl mb-4">
            Upcoming Events
          </h2>
          <p className="text-gray-500">
            Events information will be available once the venue API is updated.
          </p>
        </div>
      </div>
    </Layout>
  );
}
