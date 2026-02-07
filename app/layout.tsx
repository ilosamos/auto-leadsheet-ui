import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import React from "react";
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

export const metadata = {
  title: "Auto Leadsheet Generator",
  description:
    "Upload your audio files and get lead sheets generated automatically.",
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
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications position="top-right" />
          <AuthSessionProvider>
            <JobProvider>
              <GoogleOneTap />
              <div
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Header />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
              </div>
            </JobProvider>
          </AuthSessionProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
