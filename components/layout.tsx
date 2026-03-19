import { ReactNode } from "react";

export const siteTitle = "House Music & EDM Events Across North America";

interface LayoutProps {
  children: ReactNode;
  home?: boolean;
  canonicalUrl?: string;
}

/**
 * Layout component that provides page structure
 */
export default function Layout({
  children,
  home: _home,
  canonicalUrl: _canonicalUrl,
}: LayoutProps) {
  return (
    <div>
      <main id="main-content">{children}</main>
    </div>
  );
}
