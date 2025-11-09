import { HiMusicalNote } from "react-icons/hi2";
import { FaTicketAlt } from "react-icons/fa"; // Importing a solid ticket icon

interface ArtistImageProps {
  id?: number;
  image?: string;
  large?: boolean;
}

/**
 * ArtistImage component displays an artist image with fallback support
 */
const ArtistImage = ({ id, image, large = false }: ArtistImageProps) => {
  // Determine which image to use based on props
  let finalUrl: string;

  if (image) {
    // If image is provided, use it
    finalUrl = image;
  } else if (id) {
    // If ID is provided, use the local image path with fallback
    finalUrl = `/images/artists/${id}.jpg`;
  } else {
    // No image or ID, show only the icon
    finalUrl = "";
  }

  const sizeClasses = large ? "w-52 h-52" : "w-28 h-28";

  return (
    <div
      className={`relative ${sizeClasses} rounded-md mx-auto overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700`}
    >
      {/* Outer container */}
      <div className="relative flex items-center justify-center w-24 h-14">
        {/* Ticket Icon */}
        <FaTicketAlt className="text-gray-300 dark:text-gray-600 w-full h-full" />
        {/* Music Icon as overlay */}
        <HiMusicalNote
          className={`absolute w-4 h-4 text-gray-100 dark:text-gray-700`}
        />
      </div>
      {/* Background image div */}
      {finalUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${finalUrl}')` }}
        ></div>
      )}
    </div>
  );
};

export default ArtistImage;
