import { Metadata, Viewport } from "next";
import Layout from "@/components/layout";
import CitiesStates from "@/components/Homepage/CitiesStates";
import { getLocations } from "@/utils/getLocations";
import ClientNavigationBar from "@/app/cities/ClientNavigationBar";
import { getCanonicalUrl } from "@/utils/canonicalUrl";

export const metadata: Metadata = {
  title: "Events By City",
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
      <h1 className="text-center px-2">Events By City</h1>
      <CitiesStates locations={locations} showCitiesOnly={true} />
    </Layout>
  );
}
