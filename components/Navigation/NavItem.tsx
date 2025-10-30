import { useState } from "react";
import MenuOverlay from "../ui/MenuOverlay";
import MenuTrigger from "../ui/MenuTrigger";
import MenuList from "./MenuList";

interface NavItemProps {
  image: string;
  text: string;
  title: string;
  navItems: string[];
  setSearchTerm?: (term: string) => void;
  isLocation?: boolean;
  isHome?: boolean;
}

/**
 * NavItem component renders a navigation item with a dropdown overlay menu
 */
const NavItem = ({
  image,
  text,
  title,
  navItems,
  setSearchTerm,
  isLocation: _isLocation,
  isHome: _isHome,
}: NavItemProps) => {
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
          <h2 className="font-normal mt-10 text-lg text-blue md:inline-block md:text-xl text-2xl mb-8 text-center pt-4">
            {title}
          </h2>
          <MenuList
            navItems={navItems}
            text={text}
            isOpen={isOpen}
            title={title}
            setSearchTerm={setSearchTerm}
            onClose={handleClose}
          />
        </div>
      </MenuOverlay>
    </div>
  );
};

export default NavItem;
