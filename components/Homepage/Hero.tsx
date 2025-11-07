"use client";

import HomeSearchAutocomplete from "../SearchAutoComplete/HomeSearchAutocomplete";
import QuickLocationFinder from "../QuickLocationFinder/QuickLocationFinder";

/**
 * Hero component displays the main hero section with search and location finder
 */
const Hero = () => {
  return (
    <div className="relative h-dvh flex items-center justify-center overflow-hidden">
      {/* Animated wavy gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d0e5f5] via-[#e8d4eb] to-[#b8d5e8] animate-gradient-shift bg-[length:200%_200%]" />
      <div className="absolute inset-0 opacity-30">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(206, 49, 151, 0.15)"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,122.7C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(28, 148, 165, 0.15)"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,240C960,245,1056,235,1152,218.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full px-5 md:px-10 max-w-4xl">
        <div className="space-y-6 md:space-y-8">
          {/* Headline - left-aligned, single line, thin font */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-left text-gray-900 leading-tight">
            Find Music Events.
          </h1>

          {/* Search box */}
          <div className="w-full bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
            <HomeSearchAutocomplete />
          </div>

          {/* Location button */}
          <div className="w-full">
            <QuickLocationFinder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
