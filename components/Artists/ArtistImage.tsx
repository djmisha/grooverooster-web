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
      className={`relative bg-cover bg-center bg-no-repeat ${sizeClasses} rounded-md mx-auto overflow-hidden`}
      style={{
        backgroundImage: finalUrl ? `url('${finalUrl}')` : "none",
        backgroundSize: "cover",
      }}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          finalUrl ? "-z-10" : "z-10"
        }`}
      >
        <HiMusicalNote className="text-gray-300 dark:text-gray-600" size={48} />
      </div>
    </div>
  );
};

export default ArtistImage;
