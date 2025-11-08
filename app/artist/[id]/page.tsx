import { Metadata } from "next";
import Layout from "@/components/layout";
import {
  getArtistData,
  getArtistEvents,
  getArtistLastFM,
} from "@/utils/getArtists";
import ArtistImage from "@/components/Artists/ArtistImage";
import ArtistBio from "@/components/Artists/ArtistBio";
import GoogleAutoAds from "@/components/3rdParty/googleAds";
import ClientNavigationBar from "@/app/artist/[id]/ClientNavigationBar";
import { getCanonicalUrl } from "@/utils/canonicalUrl";
import ArtistEventsClient from "@/app/artist/[id]/ArtistEventsClient";

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ArtistPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const artistData = await getArtistData(id);
    const title = `${artistData.name} - Upcoming Events & Artist Information`;
    const description = `${artistData.name} Tour Dates, Shows, Concert Tickets & Live Streams. Learn more about ${artistData.name}`;

    return {
      title,
      description,
    };
  } catch (error) {
    return {
      title: "Artist Not Found",
    };
  }
}

export default async function Artist({ params }: ArtistPageProps) {
  const { id } = await params;

  try {
    const artistData = await getArtistData(id);
    const events = await getArtistEvents(artistData.id);
    const lastFMdata = await getArtistLastFM(artistData.name);
    const { name, slug } = artistData;
    const canonicalUrl = getCanonicalUrl(`/artist/${slug}`);

    return (
      <Layout home={false} canonicalUrl={canonicalUrl}>
        <GoogleAutoAds />
        <ClientNavigationBar />
        <div className="text-center [&_h1]:border-none [&_h1]:text-center pt-10">
          <div className="artist-header">
            <ArtistImage id={artistData.id} image={undefined} />
            <h1 className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px]">
              {name}
            </h1>
          </div>
          <ArtistBio name={name} lastFMdata={lastFMdata} />
          {events?.length != 0 && (
            <>
              <h2 className="font-normal mt-10 text-lg text-blue md:inline-block md:text-xl text-xl mb-4">
                {name} Upcoming Events
              </h2>
              <ArtistEventsClient events={events} />
            </>
          )}
        </div>
      </Layout>
    );
  } catch (error) {
    const { notFound } = await import("next/navigation");
    return notFound();
  }
}
