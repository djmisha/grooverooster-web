"use client";

import HomeSearchAutocomplete from "../SearchAutoComplete/HomeSearchAutocomplete";
import QuickLocationFinder from "../QuickLocationFinder/QuickLocationFinder";
import SoundWaveBackground from "./SoundWaveBackground";
import { useTheme } from "next-themes";

/**
 * Hero component displays the main hero section with search and location finder
 */
const Hero = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div
      className={`relative h-dvh flex items-center justify-center overflow-hidden ${
        isDarkMode ? "" : "bg-white"
      }`}
    >
      {/* Animated wavy gradient background - darker with lighter accents */}
      {isDarkMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1e] via-[#1d1d33] to-[#0c162e] animate-gradient-shift bg-[length:200%_200%]" />
      )}

      {/* Sound wave spectrum background - only visible in dark mode */}
      <SoundWaveBackground />

      <div className="relative z-10 w-full px-5 md:px-10 max-w-4xl -mt-20">
        <div className="space-y-6 md:space-y-8">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-extralight text-left leading-tight ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Find Music Events.
          </h1>

          <div className="w-full bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20">
            <HomeSearchAutocomplete />
          </div>

          <div className="flex items-center justify-center py-4">
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-full max-w-xs" />
          </div>

          <div className="w-full md:max-w-md md:mx-auto">
            <QuickLocationFinder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
