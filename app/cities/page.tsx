import { Metadata } from "next";
import Layout from "../../components/layout";
import CitiesStates from "../../components/Homepage/CitiesStates";
import { getLocations } from "../../utils/getLocations";
import NavigationBar from "../../components/Navigation/NavigataionBar";
import { getCanonicalUrl } from "../../utils/canonicalUrl";

export const metadata: Metadata = {
  title: "Events By City",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
};

export default async function CitiesPage() {
  const locations = await getLocations();
  const canonicalUrl = getCanonicalUrl('/cities');
  
  return (
    <Layout home={false} canonicalUrl={canonicalUrl}>
      <NavigationBar setSearchTerm={() => {}} locationData={{}} />
      <h1 className="text-center px-2">Events By City</h1>
      <CitiesStates locations={locations} showCitiesOnly={true} />
    </Layout>
  );
}
