import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error",
  robots: { index: false, follow: false },
};

export default function ErrorPage() {
  return <p>Sorry, something went wrong</p>;
}
