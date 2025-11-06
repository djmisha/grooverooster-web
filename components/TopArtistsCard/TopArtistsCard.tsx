import Link from "next/link";
import ArtistImage from "../Artists/ArtistImage";
import { ToSlugArtist } from "../../utils/utilities";
import { FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";

interface TopArtistsCardProps {
  artist: {
    id?: string | number;
    name: string;
    count?: number;
    locations?: number;
  };
  showCounts?: boolean;
}

/**
 * TopArtistsCard component displays an artist card with event count and locations
 */
const TopArtistsCard = ({ artist, showCounts = true }: TopArtistsCardProps) => {
  const { id, name, count, locations } = artist;

  return (
    <Link href={`/artist/${ToSlugArtist(name)}`}>
      <div className="relative transition-all duration-100 ease-out text-left py-2 px-2 mx-3 mb-6 md:m-0 md:p-2 bg-white dark:bg-gray-800 flex overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] transform-none rounded-lg md:hover:-translate-y-1 md:hover:scale-102 md:hover:shadow-md">
        <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center">
          <ArtistImage
            id={id ? (typeof id === "string" ? Number(id) : id) : undefined}
          />
        </div>
        <div className="flex flex-col ml-5 w-full h-30 relative">
          <div className="text-2xl font-semibold text-pink-500 dark:text-pink-400 absolute top-1/2 -translate-y-1/2 text-pink transition-colors duration-200">
            {name}
          </div>
          {showCounts && count && locations && (
            <div className="flex gap-4 mt-auto">
              <div className="flex items-center gap-2 text-sm font-medium leading-3 text-black dark:text-gray-200 transition-colors duration-200">
                <FaTicketAlt className="text-s text-current" />
                <span>{count} shows</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium leading-3 text-black dark:text-gray-200 transition-colors duration-200">
                <FaMapMarkerAlt className="text-sm text-current" />
                <span>{locations} cities</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TopArtistsCard;
