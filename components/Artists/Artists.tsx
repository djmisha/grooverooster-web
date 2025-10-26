import React, { ReactNode } from "react";

interface Artist {
  name: string | ReactNode;
  [key: string]: any;
}

interface ArtistsProps {
  data: Artist[];
}

/**
 * Artists component renders a list of artist names with alternating colors
 */
const Artists = ({ data }: ArtistsProps) => {
  let artists: React.ReactElement[] = [];
  data.map((artist, index) => {
    // Alternating colors: first (0) = pink, second (1) = orange, third (2) = pink, etc.
    const isPink = index % 2 === 0;
    const artistEl = (
      <div
        className="block [&_h1]:border-none [&_h1]:text-center"
        key={index}
        style={{ color: isPink ? "#ce3197" : "#f97316" }}
      >
        {artist.name}
      </div>
    );
    artists.push(artistEl);
  });
  return artists;
};

export default Artists;
