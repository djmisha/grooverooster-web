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
        <div className="p-2 pr-4 pl-4 w-full ">
          <div className="text-xl font-semibold text-pink dark:text-pink-400 transition-colors duration-200 pt-12">
            {name}
          </div>
          {showCounts && count !== undefined && locations !== undefined && (
            <div className="flex gap-2 mt-auto pt-8">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                <FaTicketAlt className="text-current text-xs" />
                <span>{count} shows</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                <FaMapMarkerAlt className="text-current text-xs" />
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
