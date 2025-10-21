import { AppProvider } from "@/features/AppContext";
import { Poppins } from "next/font/google";
import ToastProvider from "@/components/ui/ToastProvider.sonner";
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
    <html lang="en">
      <body className={poppins.className}>
        <AppProvider>
          {children}
          <ToastProvider />
        </AppProvider>
      </body>
    </html>
  );
}
