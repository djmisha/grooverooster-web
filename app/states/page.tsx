import { Metadata, Viewport } from "next";
import Layout from "@/components/layout";
import CitiesStates from "@/components/Homepage/CitiesStates";
import { getLocations } from "@/utils/getLocations";
import ClientNavigationBar from "@/app/states/ClientNavigationBar";
import { getCanonicalUrl } from "@/utils/canonicalUrl";

export const metadata: Metadata = {
  title: "Events By State",
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
