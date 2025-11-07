import { useContext } from "react";
import { AppContext } from "../../features/AppContext";

/**
 * WelcomeMessage component displays a welcome message when user hasn't set a location
 */
export default function WelcomeMessage() {
  const context = useContext(AppContext);

  // Hide the message if user has a location set
  if (context?.currentUserLocation) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-gray-200 p-6 text-center rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <h2 className="font-normal mt-10 text-lg text-blue md:inline-block md:text-xl text-2xl font-bold pb-3 text-gray-800 dark:text-gray-200">
        Welcome to Our Dance Music Community!
      </h2>
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <p className="text-lg">
          Discover top artists, explore exciting locations, and immerse yourself
          in vibrant dance music scenes around the world.
        </p>
        <p className="text-sm bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mx-auto max-w-md">
          💡 <strong>Tip:</strong> Enable location services or search for your
          city to see personalized events and venues near you!
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm text-gray-600 dark:text-gray-400">
          <span>🎵 Browse events by city</span>
          <span className="hidden sm:inline">•</span>
          <span>🎯 Search for your favorite artists</span>
          <span className="hidden sm:inline">•</span>
          <span>📍 Discover new venues</span>
        </div>
        <p className="text-base font-medium text-gray-800 dark:text-gray-200 pt-2">
          Start your dance music adventure today!
        </p>
      </div>
    </div>
  );
}
