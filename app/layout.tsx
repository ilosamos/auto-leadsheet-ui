import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import React from "react";
import type { Metadata } from "next";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "../theme";
import { AuthSessionProvider } from "../providers/AuthSessionProvider";
import { JobProvider } from "../providers/JobProvider";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { GoogleOneTap } from "../components/GoogleOneTap";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://leadsheet.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "leadsheet.me - Auto Leadsheet Generator",
    template: "%s | leadsheet.me",
  },
  description:
    "Upload your audio files and get lead sheets generated automatically.",
  openGraph: {
    title: "leadsheet.me - Auto Leadsheet Generator",
    description:
      "Upload your audio files and get lead sheets generated automatically.",
    url: siteUrl,
    siteName: "leadsheet.me",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "leadsheet.me - Auto Leadsheet Generator",
    description:
      "Upload your audio files and get lead sheets generated automatically.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ margin: 0 }}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications position="top-right" />
          <AuthSessionProvider>
            <GoogleOneTap />
            <JobProvider>
              <div>
                <Header />
                <main className="app-main">{children}</main>
                <Footer />
              </div>
            </JobProvider>
          </AuthSessionProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
