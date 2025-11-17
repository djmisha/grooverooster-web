import { AppProvider } from "@/features/AppContext";
import { Poppins } from "next/font/google";
import ToastProvider from "@/components/ui/ToastProvider.sonner";
import SkipLink from "@/components/SkipLink/SkipLink";
import { ThemeProvider } from "@/components/ThemeProvider";
import NextTopLoader from "nextjs-toploader";
import "../styles/tailwind.css";
import "../styles/global.scss";
import type { Metadata } from "next";

const poppins = Poppins({
  weight: ["200", "400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GrooveRooster - Discover Electronic Music Events Near You",
    template: "%s | GrooveRooster",
  },
  description:
    "Find the best electronic music events, shows, and festivals in your city. Track your favorite artists and never miss a beat.",
};

/**
 * Root layout component that wraps the entire application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Root HTML structure with providers and global styles
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <NextTopLoader
          color="#ce3197"
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ce3197,0 0 5px #ce3197"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SkipLink />
          <AppProvider>
            {children}
            <ToastProvider />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
