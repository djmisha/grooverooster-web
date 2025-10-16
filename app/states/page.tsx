import { Metadata } from "next";
import Layout from "../../components/layout";
import CitiesStates from "../../components/Homepage/CitiesStates";
import { getLocations } from "../../utils/getLocations";
import ClientNavigationBar from "./ClientNavigationBar";
import { getCanonicalUrl } from "../../utils/canonicalUrl";

export const metadata: Metadata = {
  title: "Events By State",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
};

export default async function StatesPage() {
  const locations = await getLocations();
  const canonicalUrl = getCanonicalUrl('/states');
  
  return (
    <Layout home={false} canonicalUrl={canonicalUrl}>
      <ClientNavigationBar />
      <h1>Events By State</h1>
      <CitiesStates locations={locations} showStatesOnly={true} />
    </Layout>
  );
}
