interface ArtistImageProps {
  id?: number;
  imageUrl?: string;
}

/**
 * ArtistImage component displays an artist image with fallback support
 */
const ArtistImage = ({ id, imageUrl }: ArtistImageProps) => {
  // Determine which image to use based on props
  let finalUrl: string;

  if (imageUrl) {
    // If imageUrl is provided, use it (for remote images like Ticketmaster)
    finalUrl = imageUrl;
  } else if (id) {
    // If ID is provided, use the local image path with fallback
    finalUrl = `/images/artists/${id}.jpg`;
  } else {
    // No imageUrl or ID, use fallback directly
    finalUrl = "/images/housemusic192.png";
  }

  return (
    <div
      className="bg-white bg-cover bg-center bg-no-repeat w-28 h-28 rounded-md mx-auto overflow-hidden"
      style={{
        backgroundImage: `url('${finalUrl}'), url('/images/housemusic192.png')`,
        backgroundSize: "cover",
      }}
    ></div>
  );
};

export default ArtistImage;
