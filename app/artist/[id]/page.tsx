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
    const description = `${artistData.name} tour dates, shows, DJ sets & live streams. Find tickets and upcoming events for ${artistData.name} near you.`;
    const canonicalUrl = getCanonicalUrl(`/artist/${artistData.slug}`);

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "profile",
        images: [
          {
            url: "/images/housemusic.png",
            width: 1200,
            height: 630,
            alt: `${artistData.name} - Upcoming Events`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/images/housemusic.png"],
      },
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
          <div className="artist-header mt-2">
            <div className="rounded-xl overflow-hidden mx-auto w-fit pt-4">
              <ArtistImage id={artistData.id} image={undefined} large={true} />
            </div>
            <h1 className="mt-5 text-[25px] text-pink font-normal md:mt-5 md:block md:text-[37.5px] pb-2">
              {name}
            </h1>
          </div>
          <ArtistBio name={name} lastFMdata={lastFMdata} />
          {events?.length != 0 && (
            <>
              <h2 className="font-normal mt-10 text-lg text-pink md:inline-block md:text-xl pb-3">
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
