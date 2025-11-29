import React, { ReactNode } from "react";
import Link from "next/link";
import { FiLink } from "react-icons/fi";
import { getArtistSlug } from "@/utils/artistImageLookup";

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
    const artistSlug =
      showLinks && artistName
        ? getArtistSlug({ id: artist.id, name: artistName })
        : undefined;

    const artistEl = artistSlug ? (
      <div
        className="block [&_h1]:border-none [&_h1]:text-center"
        key={index}
        style={{ color }}
      >
        <Link
          href={`/artist/${artistSlug}`}
          className="inline-flex items-center gap-1 border-b border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 transition-colors"
          style={{ color }}
        >
          {artist.name}
          <FiLink className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
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
