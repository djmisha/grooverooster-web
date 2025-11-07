import { Menu, MapPin, User } from "lucide-react";
import { ReactNode } from "react";

interface MenuTriggerProps {
  onClick: () => void;
  text: string;
  icon?: "menu" | "map" | "user";
  iconNode?: ReactNode;
  className?: string;
}

/**
 * MenuTrigger component renders a button with icon and text for opening menus
 * Now uses Lucide React icons for better dark mode support
 */
const MenuTrigger = ({
  onClick,
  text,
  icon,
  iconNode,
  className = "",
}: MenuTriggerProps) => {
  // Map icon names to Lucide components
  const getIcon = () => {
    if (iconNode) return iconNode;

    switch (icon) {
      case "menu":
        return <Menu size={26} className="text-black dark:text-gray-200" />;
      case "map":
        return <MapPin size={22} className="text-black dark:text-gray-200" />;
      case "user":
        return <User size={22} className="text-black dark:text-gray-200" />;
      default:
        return null;
    }
  };

  return (
    <button
      className={`cursor-pointer flex flex-col items-center justify-center gap-1 p-2 bg-transparent border-none transition-all duration-200 ease-in-out text-black dark:text-gray-200 visited:text-black dark:visited:text-gray-200 ${className}`}
      onClick={onClick}
      aria-label={text || "Open menu"}
    >
      {getIcon()}
      {text && (
        <span className="text-xs font-medium uppercase tracking-wider text-black dark:text-gray-200">
          {text}
        </span>
      )}
    </button>
  );
};

export default MenuTrigger;
