import { Metadata } from "next";
import MakeItRainClient from "./MakeItRainClient";

export const metadata: Metadata = {
  title: "Make it Rain! 💰",
  description:
    "Feel like Elon Musk! Click the button and watch the money rain down. The ultimate GrooveRooster wealth experience.",
};

/**
 * Make it Rain page - a fun interactive money rain experience
 */
export default function MakeItRainPage() {
  return <MakeItRainClient />;
}
