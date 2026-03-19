import { Metadata, Viewport } from "next";
import Layout from "@/components/layout";
import CitiesStates from "@/components/Homepage/CitiesStates";
import { getLocations } from "@/utils/getLocations";
import ClientNavigationBar from "@/app/states/ClientNavigationBar";
import { getCanonicalUrl } from "@/utils/canonicalUrl";

export const metadata: Metadata = {
  title: "Events By State",
  description:
    "Find electronic music events, EDM shows and nightclub DJ events by state across North America. Browse house music and dance music events in your state.",
  alternates: {
    canonical: "https://www.grooverooster.com/states",
  },
  openGraph: {
    title: "Events By State - GrooveRooster",
    description:
      "Find electronic music events, EDM shows and nightclub DJ events by state across North America.",
    type: "website",
    url: "https://www.grooverooster.com/states",
    images: [
      {
        url: "/images/housemusic.png",
        width: 1200,
        height: 630,
        alt: "Electronic Music Events By State",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events By State - GrooveRooster",
    description:
      "Find electronic music events, EDM shows and nightclub DJ events by state across North America.",
    images: ["/images/housemusic.png"],
  },
};

/**
 * States page component displays events organized by state
 * @returns {Promise<JSX.Element>} States listing page
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default async function StatesPage() {
  const locations = await getLocations();
  const canonicalUrl = getCanonicalUrl("/states");

  return (
    <Layout home={false} canonicalUrl={canonicalUrl}>
      <ClientNavigationBar />
      <h1 className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px]">
        Events By State
      </h1>
      <CitiesStates locations={locations} showStatesOnly={true} />
    </Layout>
  );
}
