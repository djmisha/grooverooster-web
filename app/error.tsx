"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary for the Next.js App Router.
 * Catches unexpected runtime errors and offers the user a recovery option.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Something went wrong
      </h1>
      <p className="max-w-md text-gray-500 dark:text-gray-400">
        An unexpected error occurred. Please try again or refresh the page.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-pink px-6 py-2 text-white transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
}
