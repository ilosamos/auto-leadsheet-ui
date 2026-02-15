import type { Metadata } from "next";

import { HomePageClient } from "./HomePageClient";

export const metadata: Metadata = {
  title: "Leadsheet.me | Auto Leadsheet Generator",
  description:
    "Generate lead sheets from your audio files with chords and structure.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
