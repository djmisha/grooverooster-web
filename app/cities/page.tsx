import { Metadata, Viewport } from "next";
import Layout from "@/components/layout";
import CitiesStates from "@/components/Homepage/CitiesStates";
import { getLocations } from "@/utils/getLocations";
import ClientNavigationBar from "@/app/cities/ClientNavigationBar";
import { getCanonicalUrl } from "@/utils/canonicalUrl";

export const metadata: Metadata = {
  title: "Events By City",
  description:
    "Find electronic music events, EDM shows and nightclub DJ events in cities across North America. Browse events by city to discover house music and dance music near you.",
  openGraph: {
    title: "Events By City - GrooveRooster",
    description:
      "Find electronic music events, EDM shows and nightclub DJ events in cities across North America.",
    type: "website",
    url: "https://www.grooverooster.com/cities",
    images: [
      {
        url: "/images/housemusic.png",
        width: 1200,
        height: 630,
        alt: "Electronic Music Events By City",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events By City - GrooveRooster",
    description:
      "Find electronic music events, EDM shows and nightclub DJ events in cities across North America.",
    images: ["/images/housemusic.png"],
  },
};

/**
 * Cities page component displays events organized by city
 * @returns {Promise<JSX.Element>} Cities listing page
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default async function CitiesPage() {
  const locations = await getLocations();
  const canonicalUrl = getCanonicalUrl("/cities");

  return (
    <Layout home={false} canonicalUrl={canonicalUrl}>
      <ClientNavigationBar />
      <h1 className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px] text-center px-2">
        Events By City
      </h1>
      <CitiesStates locations={locations} showCitiesOnly={true} />
    </Layout>
  );
}
