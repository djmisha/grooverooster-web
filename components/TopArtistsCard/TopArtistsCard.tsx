import Link from "next/link";
import ArtistImage from "@/components/Artists/ArtistImage";
import { ToSlugArtist } from "@/utils/utilities";
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
      <div className="relative transition-all duration-100 ease-out text-left mx-3 mb-6 md:m-0 bg-white dark:bg-gray-800 flex overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] transform-none rounded-lg md:hover:-translate-y-0.5 md:hover:scale-[1.005] md:hover:shadow-lg dark:md:hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4)]">
        <div className="flex-shrink-0 w-40 h-40 bg-no-repeat bg-cover">
          <ArtistImage
            id={id ? (typeof id === "string" ? Number(id) : id) : undefined}
          />
        </div>
        <div className="flex flex-col p-4 pr-4 pl-4 w-full justify-center gap-2">
          <div className="text-2xl font-semibold text-pink-500 dark:text-pink-400 transition-colors duration-200">
            {name}
          </div>
          {showCounts && count !== undefined && locations !== undefined && (
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm font-medium leading-3 text-gray-600 dark:text-gray-400 transition-colors duration-200">
                <FaTicketAlt className="text-current" />
                <span>{count} shows</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium leading-3 text-gray-600 dark:text-gray-400 transition-colors duration-200">
                <FaMapMarkerAlt className="text-current" />
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
