import { HiMusicalNote } from "react-icons/hi2";

interface ArtistImageProps {
  id?: number;
  imageUrl?: string;
  large?: boolean;
}

/**
 * ArtistImage component displays an artist image with fallback support
 */
const ArtistImage = ({ id, imageUrl, large = false }: ArtistImageProps) => {
  // Determine which image to use based on props
  let finalUrl: string;

  if (imageUrl) {
    // If imageUrl is provided, use it (for remote images like Ticketmaster)
    finalUrl = imageUrl;
  } else if (id) {
    // If ID is provided, use the local image path with fallback
    finalUrl = `/images/artists/${id}.jpg`;
  } else {
    // No imageUrl or ID, show only the icon
    finalUrl = "";
  }

  const sizeClasses = large ? "w-52 h-52" : "w-28 h-28";

  return (
    <div
      className={`relative ${sizeClasses} rounded-md mx-auto overflow-hidden flex items-center justify-center ${
        !finalUrl ? "border border-gray-200 dark:border-gray-700" : ""
      }`}
    >
      {/* Outer container */}
      <HiMusicalNote className="text-gray-300 dark:text-gray-600" size={48} />
      {/* Fallback icon */}
      {/* Background image div */}
      {finalUrl /* Background image div */ && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${finalUrl}')` }}
        ></div>
      )}
    </div>
  );
};

export default ArtistImage;
