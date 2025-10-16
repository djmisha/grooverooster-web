import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useCurrentUrl = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [pathname, searchParams]);

  return currentUrl;
};
