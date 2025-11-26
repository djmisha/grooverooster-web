import React, { ReactNode } from "react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { getArtistDbId } from "@/utils/artistImageLookup";

interface Artist {
  name: string | ReactNode;
  id?: string | number;
  [key: string]: any;
}

interface ArtistsProps {
  data: Artist[];
  showLinks?: boolean;
}

/**
 * Artists component renders a list of artist names with alternating colors
 * Links to artist page if artist exists in local database (only when showLinks is true)
 */
const Artists = ({ data, showLinks = false }: ArtistsProps) => {
  let artists: React.ReactElement[] = [];
  data.map((artist, index) => {
    // Alternating colors: first (0) = pink, second (1) = orange, third (2) = pink, etc.
    const isPink = index % 2 === 0;
    const color = isPink ? "#ce3197" : "#f97316";

    // Check if artist exists in database (only if name is a string and showLinks is true)
    const artistName =
      typeof artist.name === "string" ? artist.name : undefined;
    const artistDbId =
      showLinks && artistName
        ? getArtistDbId({ id: artist.id, name: artistName })
        : undefined;

    const artistEl = artistDbId ? (
      <div
        className="block [&_h1]:border-none [&_h1]:text-center"
        key={index}
        style={{ color }}
      >
        <Link
          href={`/artist/${artistDbId}`}
          className="inline-flex items-center gap-1 border-b border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 transition-colors"
          style={{ color }}
        >
          {artist.name}
          <FiExternalLink className="w-3.5 h-3.5 opacity-60" />
        </Link>
      </div>
    ) : (
      <div
        className="block [&_h1]:border-none [&_h1]:text-center"
        key={index}
        style={{ color }}
      >
        {artist.name}
      </div>
    );
    artists.push(artistEl);
  });
  return artists;
};

export default Artists;
