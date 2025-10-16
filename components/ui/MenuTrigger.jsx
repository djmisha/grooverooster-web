import Image from "next/image";

/**
 * MenuTrigger component renders a button with icon and text for opening menus
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler
 * @param {string} props.text - Button text label
 * @param {string} props.icon - Icon image path
 * @param {string} [props.iconAlt="Menu"] - Alt text for icon
 * @param {number} [props.iconWidth=22] - Icon width in pixels
 * @param {number} [props.iconHeight=22] - Icon height in pixels
 * @param {string} [props.className=""] - Additional CSS classes
 * @returns {JSX.Element} Menu trigger button
 */
const MenuTrigger = ({
  onClick,
  text,
  icon,
  iconAlt = "Menu",
  iconWidth = 22,
  iconHeight = 22,
  className = "",
}) => {
  return (
    <button
      className={`cursor-pointer flex flex-col items-center justify-center gap-2 p-2 bg-transparent border-none transition-all duration-200 ease-in-out text-black visited:text-black ${className}`}
      onClick={onClick}
      aria-label={text || "Open menu"}
    >
      {icon && (
        <Image src={icon} alt={iconAlt} width={iconWidth} height={iconHeight} />
      )}
      {text && (
        <span className="text-xs font-medium uppercase tracking-wider text-black">
          {text}
        </span>
      )}
    </button>
  );
};

export default MenuTrigger;
