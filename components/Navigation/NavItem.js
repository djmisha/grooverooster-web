import { useState } from "react";
import MenuOverlay from "../ui/MenuOverlay";
import MenuTrigger from "../ui/MenuTrigger";
import MenuList from "./MenuList";

/**
 * NavItem component renders a navigation item with a dropdown overlay menu
 * @param {Object} props - Component props
 * @param {string} props.image - Path to the icon image
 * @param {string} props.text - Display text for the nav item
 * @param {string} props.title - Title displayed in the overlay menu
 * @param {Array} props.navItems - Array of menu items to display
 * @param {Function} props.setSearchTerm - Function to set search term
 * @param {boolean} props.isLocation - Whether this is a location nav item
 * @param {boolean} props.isHome - Whether this is displayed on the home page
 * @returns {JSX.Element} Navigation item with overlay menu
 */
const NavItem = ({
  image,
  text,
  title,
  navItems,
  setSearchTerm,
  isLocation,
  isHome,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Closes the overlay menu
   */
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <MenuTrigger
        icon={image}
        text={text}
        onClick={() => setIsOpen(true)}
        iconAlt={text}
      />
      <MenuOverlay isOpen={isOpen} onClose={handleClose}>
        <div className="px-4">
          <h2 className="text-2xl mb-8 text-center pt-4">{title}</h2>
          <MenuList
            navItems={navItems}
            text={text}
            isOpen={isOpen}
            title={title}
            setSearchTerm={setSearchTerm}
            isLocation={isLocation}
            isHome={isHome}
            onClose={handleClose}
          />
        </div>
      </MenuOverlay>
    </div>
  );
};

export default NavItem;
