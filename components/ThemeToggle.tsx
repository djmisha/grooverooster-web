"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";

/**
 * ThemeToggle component - Provides a button to switch between light and dark mode
 * Uses next-themes for theme management
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return (
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 min-w-[140px] min-h-[44px]"
        aria-label="Toggle theme"
      >
        <span className="opacity-0">Loading...</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  const buttonClasses = [
    "flex items-center gap-2 px-4 py-2 rounded-lg border-2",
    "border-gray-300 dark:border-gray-600",
    "bg-white dark:bg-gray-800",
    "text-gray-800 dark:text-gray-200",
    "transition-all duration-200",
    "hover:border-pink dark:hover:border-pink hover:shadow-md",
  ].join(" ");

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={buttonClasses}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <>
          <FaSun className="text-yellow-500 text-lg" />
          <span className="text-sm font-medium">Light Mode</span>
        </>
      ) : (
        <>
          <FaMoon className="text-blue-500 text-lg" />
          <span className="text-sm font-medium">Dark Mode</span>
        </>
      )}
    </button>
  );
}
