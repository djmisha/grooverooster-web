import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Custom hook that returns the current full URL of the page
 * @returns Current URL including protocol, host, pathname and search params
 */
export const useCurrentUrl = (): string => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [pathname, searchParams]);

  return currentUrl;
};
