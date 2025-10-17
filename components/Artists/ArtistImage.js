import PropTypes from "prop-types";

/**
 * ArtistImage component displays an artist image with fallback support
 * @param {Object} props - Component props
 * @param {number} [props.id] - Artist ID to construct local image path
 * @param {string} [props.imageUrl] - Remote image URL (e.g., from Ticketmaster)
 * @returns {JSX.Element} Artist image div with background image and fallback
 */
const ArtistImage = ({ id, imageUrl }) => {
  // Determine which image to use based on props
  let finalUrl;

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

ArtistImage.propTypes = {
  id: PropTypes.number,
  imageUrl: PropTypes.string,
};

export default ArtistImage;
