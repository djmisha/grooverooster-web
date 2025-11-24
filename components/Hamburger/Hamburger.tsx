import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { AppContext } from "@/features/AppContext";
import { toSlug } from "@/utils/getLocations";
import MenuOverlay from "@/components/ui/MenuOverlay";
import MenuTrigger from "@/components/ui/MenuTrigger";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Home,
  Music,
  Building2,
  Map,
  LogIn,
  LayoutDashboard,
} from "lucide-react";

interface LocationLinkProps {
  city?: string;
  state: string;
  onClick: () => void;
}

/**
 * LocationLink component renders a link to a location's events page
 */
const LocationLink = ({ city, state, onClick }: LocationLinkProps) => {
  const href = `/events/${toSlug(city || state)}`;
  const label = city ? `${city}, ${state}` : state;

  return (
    <Link href={href} onClick={onClick} shallow={false}>
      {label}
    </Link>
  );
};

/**
 * Hamburger component displays a mobile navigation menu with recently viewed locations
 */
const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(AppContext);

  /**
   * Closes the menu overlay
   */
  const handleClose = () => {
    setIsOpen(false);
  };

  const menuContent = (
    <>
      <div className="flex flex-col border-t border-gray-300 dark:border-gray-600">
        <Link
          href="/"
          onClick={handleClose}
          className="flex items-center gap-3 px-4 py-4 text-xl border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-600/10 dark:hover:bg-indigo-400/10 transition-colors duration-200"
        >
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link
          href="/artists"
          onClick={handleClose}
          className="flex items-center gap-3 px-4 py-4 text-xl border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-600/10 dark:hover:bg-indigo-400/10 transition-colors duration-200"
        >
          <Music size={24} />
          <span>Top Artists</span>
        </Link>
        <Link
          href="/cities"
          onClick={handleClose}
          className="flex items-center gap-3 px-4 py-4 text-xl border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-600/10 dark:hover:bg-indigo-400/10 transition-colors duration-200"
        >
          <Building2 size={24} />
          <span>Events by City</span>
        </Link>
        <Link
          href="/states"
          onClick={handleClose}
          className="flex items-center gap-3 px-4 py-4 text-xl border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-600/10 dark:hover:bg-indigo-400/10 transition-colors duration-200"
        >
          <Map size={24} />
          <span>Events by State</span>
        </Link>
        {context && context.isLoggedIn ? (
          <Link
            href="/dashboard"
            onClick={handleClose}
            className="flex items-center gap-3 px-4 py-4 text-xl border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-600/10 dark:hover:bg-indigo-400/10 transition-colors duration-200"
          >
            <LayoutDashboard size={24} />
            <span>Dashboard</span>
          </Link>
        ) : (
          <Link
            href="/login"
            onClick={handleClose}
            className="flex items-center gap-3 px-4 py-4 text-xl border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-600/10 dark:hover:bg-indigo-400/10 transition-colors duration-200"
          >
            <LogIn size={24} />
            <span>Login / Sign Up</span>
          </Link>
        )}
      </div>

      {context && context.locationCtx?.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-600">
          <span className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
            Recently Viewed
          </span>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {context.locationCtx?.map((location) => (
              <li key={`${location.city}-${location.state}`}>
                <LocationLink
                  city={location.city}
                  state={location.state}
                  onClick={handleClose}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex-grow"></div>

      {/* Dark Mode Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-600 flex justify-center">
        <ThemeToggle />
      </div>

      <div className="p-8 border-t border-gray-200 dark:border-gray-600 flex flex-col items-center pb-10">
        <Image
          width={100}
          height={100}
          src="/images/logo.png"
          alt="GrooveRooster Logo"
          className="max-w-full h-auto mb-2"
        />
        <p className="text-md text-gray-600 dark:text-gray-400">
          Groove Rooster
        </p>
      </div>
    </>
  );

  return (
    <>
      <div className="flex flex-nowrap items-center justify-around relative left-0 h-15 pb-0 bg-gray-100 dark:bg-gray-900 md:m-0 transition-colors duration-200">
        <MenuTrigger icon="menu" text="Menu" onClick={() => setIsOpen(true)} />
      </div>
      <MenuOverlay isOpen={isOpen} onClose={handleClose}>
        {menuContent}
      </MenuOverlay>
    </>
  );
};

export default Hamburger;
