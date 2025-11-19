"use client";

import { useState, useEffect, useRef } from "react";
import { shuffleArray, filterSurpriseGuest } from "@/utils/utilities";
import TopArtistsCard from "@/components/TopArtistsCard/TopArtistsCard";
import Button from "@/components/Button/Button";
import ButtonWrapper from "@/components/Button/ButtonWrapper";
import { Artist } from "@/types";

/**
 * TopArtists component displays a randomized grid of top performing artists
 */
const TopArtists = () => {
  const [randomArtists, setRandomArtists] = useState<Artist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchArtists = async () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        console.error(
          "NEXT_PUBLIC_BASE_URL is not set in your environment variables."
        );
        return;
      }

      const res = await fetch(`${baseUrl}/api/supabase/gettopartists`);
      if (res.ok) {
        const data = await res.json();
        setArtists(data.data);
      } else {
        console.error("Error fetching data: ", res.status);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    const result = shuffleArray(filterSurpriseGuest(artists));
    if (result) {
      setRandomArtists(result);
    }
  }, [artists]);

  return (
    <>
      <h2 className="font-normal mt-10 text-lg text-blue md:inline-block md:text-xl px-4">
        Top Touring Artists
      </h2>
      <p className="p-4">
        Discover our selection of top touring artists, ranked by their number of
        shows and city appearances. Click to learn more about each artist, read
        their bios, and explore upcoming events.
      </p>
      <div className="p-0 pb-10 transition-all duration-200 ease-out sm:px-3 sm:grid sm:grid-cols-2 sm:gap-4 md:mb-5 xl:grid-cols-3">
        {randomArtists?.map((artist, index) => {
          if (index >= 9) return null;
          return <TopArtistsCard key={artist.id} artist={artist} />;
        })}
      </div>
      <ButtonWrapper>
        <Button href="/artists" variant="primary">
          View More Top Touring Artists
        </Button>
      </ButtonWrapper>
    </>
  );
};

export default TopArtists;
