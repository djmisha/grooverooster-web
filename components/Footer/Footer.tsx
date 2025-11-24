import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExternalLink } from "lucide-react";

/**
 * Footer component displays site navigation, data partners, and copyright information
 */
const Footer = () => {
  return (
    <footer className="py-20 px-4 pb-10 mt-36 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-t-2 border-gray-200 dark:border-gray-700 mt-10 transition-colors duration-200">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-10">
        <div className="flex items-start mt-8 min-w-[200px] col-span-1 md:col-span-1">
          <Image
            width={100}
            height={100}
            src="/images/logo.png"
            alt="grooverooster.com"
            className="max-w-full h-auto"
          />
        </div>

        <div className="col-span-2 flex flex-row gap-4 items-start">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="font-normal mt-10 text-sm text-blue md:inline-block text-gray-700 dark:text-gray-300 mb-3 text-base">
              Music Events Near You
            </h3>
            <Link
              href="/"
              className="text-gray-500 dark:text-gray-400 text-lg no-underline transition-colors hover:text-gray-800 dark:hover:text-gray-200"
            >
              Home
            </Link>
            <Link
              href="/artists"
              className="text-gray-500 dark:text-gray-400 text-lg no-underline transition-colors hover:text-gray-800 dark:hover:text-gray-200"
            >
              Top Artists
            </Link>
            <Link
              href="/cities"
              className="text-gray-500 dark:text-gray-400 text-lg no-underline transition-colors hover:text-gray-800 dark:hover:text-gray-200"
            >
              Events by City
            </Link>
            <Link
              href="/states"
              className="text-gray-500 dark:text-gray-400 text-lg no-underline transition-colors hover:text-gray-800 dark:hover:text-gray-200"
            >
              Events by State
            </Link>
            <Link
              href="/login"
              className="text-gray-500 dark:text-gray-400 text-lg no-underline transition-colors hover:text-gray-800 dark:hover:text-gray-200"
            >
              Login / Signup
            </Link>
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="font-normal mt-10 text-sm text-blue md:inline-block text-gray-700 dark:text-gray-300 mb-3 text-base">
              Data Sources
            </h3>
            <Link
              href="https://djmisha.com"
              target="_blank"
              title="San Diego DJ"
              className="text-gray-500 dark:text-gray-400 text-lg no-underline transition-colors hover:text-gray-800 dark:hover:text-gray-200 inline-flex items-center gap-1"
            >
              San Diego DJ
              <ExternalLink className="w-3 h-3" aria-label="Opens in new tab" />
            </Link>
            <Link
              href="https://edmtrain.com"
              target="_blank"
              className="text-gray-500 dark:text-gray-400 text-lg no-underline transition-colors hover:text-gray-800 dark:hover:text-gray-200 inline-flex items-center gap-1"
            >
              EDM Train
              <ExternalLink className="w-3 h-3" aria-label="Opens in new tab" />
            </Link>
            <Link
              href="https://www.last.fm"
              target="_blank"
              className="text-gray-500 dark:text-gray-400 text-lg no-underline transition-colors hover:text-gray-800 dark:hover:text-gray-200 inline-flex items-center gap-1"
            >
              Last Fm
              <ExternalLink className="w-3 h-3" aria-label="Opens in new tab" />
            </Link>
            <Link
              href="https://www.ticketmaster.com"
              target="_blank"
              className="text-gray-500 dark:text-gray-400 text-lg no-underline transition-colors hover:text-gray-800 dark:hover:text-gray-200 inline-flex items-center gap-1"
            >
              Ticketmaster
              <ExternalLink className="w-3 h-3" aria-label="Opens in new tab" />
            </Link>
          </div>
        </div>

        {/* <div>
          <h3 className="font-normal mt-10 text-lg text-blue md:inline-block text-gray-800 mb-6 text-lg">Follow Us</h3>
          <div className="flex gap-5">
            <a
              rel="noreferrer"
              target="_blank"
              href="https://twitch.tv/sdhousemusic/"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <Image
                width={30}
                height={30}
                src="/images/icon-twitch.svg"
                alt="Twitch"
              />
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.instagram.com/sdhousemusic/"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <Image
                width={30}
                height={30}
                src="/images/icon-instagram.svg"
                alt="Instagram"
              />
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.facebook.com/San-Diego-House-Music-135772356433768/"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <Image
                width={30}
                height={30}
                src="/images/icon-facebook.svg"
                alt="Facebook"
              />
            </a>
          </div>
        </div> */}
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center gap-4 mb-4">
          <ThemeToggle />
        </div>
        <div className="text-center">
          <p className="my-2 text-gray-400 dark:text-gray-500 text-xs">
            &copy; 2010 - {new Date().getFullYear()} grooverooster.com. All
            rights reserved.{" "}
            <Link
              href="/privacy-policy"
              className="hover:text-gray-800 dark:hover:text-gray-300"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
