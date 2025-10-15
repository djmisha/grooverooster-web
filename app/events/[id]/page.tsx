import { Metadata } from "next";
import Layout from "../../../components/layout";
import {
  getLocationData,
  isStateLandingPage,
  getStateInfo,
} from "../../../utils/getLocations";
import { makePageTitle, makePageDescription } from "../../../utils/utilities";
import EventsModule from "../../../components/EventsModule/EventsModule";
import StateLandingPage from "../../../components/StateLandingPage/StateLandingPage";
import { getSDHMEvents } from "../../../utils/getEvents";
import { getCanonicalUrl } from "../../../utils/canonicalUrl";
import { headers } from "next/headers";

interface LocationPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; eventId?: string }>;
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  
  if (isStateLandingPage(slug)) {
    const stateInfo = getStateInfo(slug);
    if (stateInfo) {
      const title = makePageTitle(null, stateInfo.name);
      const description = makePageDescription(null, stateInfo.name);
      return { title, description };
    }
  }
  
  const locationData = getLocationData(slug);
  if (locationData.id) {
    const { city, state } = locationData;
    const title = makePageTitle(city, state);
    const description = makePageDescription(city, state);
    return { title, description };
  }
  
  return { title: "Location Not Found" };
}

export default async function Location({ params, searchParams }: LocationPageProps) {
  const { id: slug } = await params;
  const { page, eventId } = await searchParams;
  const initialPage = parseInt(page || "1") || 1;
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Check if this is a state landing page
  if (isStateLandingPage(slug)) {
    const stateInfo = getStateInfo(slug);

    if (!stateInfo) {
      const { notFound } = await import("next/navigation");
      notFound();
    }

    const canonicalUrl = getCanonicalUrl(`/events/${stateInfo.slug}`);

    // If state has cities, show city links
    if (stateInfo.hasCities) {
      return (
        <Layout canonicalUrl={canonicalUrl}>
          <StateLandingPage
            stateName={stateInfo.name}
            cities={stateInfo.cities}
            locationData={{
              id: stateInfo.id,
              city: null,
              state: stateInfo.name,
              slug: stateInfo.slug,
            }}
          />
        </Layout>
      );
    }

    // If state has no cities, fetch events directly via EDM TRAIN API
    let events = [];
    try {
      if (!stateInfo.city) {
        const apiUrl = `http://${host}/api/events/${stateInfo.id}`;
        const response = await fetch(apiUrl, { cache: "no-store" });

        if (response.ok) {
          const data = await response.json();
          events = data.data || [];
        } else {
          console.error(`API response error: ${response.status}`);
          events = [];
        }
      } else {
        console.warn("Skipping state API call - city present in location data");
        events = [];
      }
    } catch (error) {
      console.error("Error fetching events from local API for state:", error);
      events = [];
    }

    return (
      <Layout canonicalUrl={canonicalUrl}>
        <EventsModule
          key={stateInfo.id}
          locationData={{
            id: stateInfo.id,
            city: null,
            state: stateInfo.name,
            slug: stateInfo.slug,
          }}
          events={events}
          initialPage={initialPage}
          eventId={eventId}
        />
      </Layout>
    );
  }

  // Default behavior for city/regular location pages
  const locationData = getLocationData(slug);

  if (!locationData.id) {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  // Call the SDHM API and process events
  let events = [];
  try {
    events = await getSDHMEvents(locationData.id, locationData.city);
  } catch (error) {
    console.error("Error fetching events from SDHM API:", error);
    events = [];
  }

  const { city, state } = locationData;
  const canonicalUrl = getCanonicalUrl(`/events/${locationData.slug}`);

  return (
    <Layout canonicalUrl={canonicalUrl}>
      <EventsModule
        key={locationData.id}
        locationData={locationData}
        events={events}
        initialPage={initialPage}
        eventId={eventId}
      />
    </Layout>
  );
}
