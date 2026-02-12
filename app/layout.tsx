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
  title: "leadsheet.me - Auto Leadsheet Generator",
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
        <style>{`
          .app-shell {
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .app-main {
            flex: 1;
            min-height: 0;
            overflow: hidden;
          }
          @media (max-width: 48em) {
            .app-shell {
              min-height: 100vh;
              height: auto;
              overflow: visible;
            }
            .app-main {
              overflow: visible;
            }
          }
          .app-shell:has(.standalone-page) {
            min-height: 100vh;
            height: auto;
            overflow: visible;
          }
          .app-shell:has(.standalone-page) .app-main {
            overflow: visible;
          }
        `}</style>
      </head>
      <body style={{ margin: 0 }}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications position="top-right" />
          <AuthSessionProvider>
            <GoogleOneTap />
            <JobProvider>
              <div className="app-shell">
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
