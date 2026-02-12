"use client";

import { Container } from "@mantine/core";
import { HeroHeader } from "../components/HeroHeader";
import { AppTabs } from "../components/AppTabs";
import "./client/config";

export default function HomePage() {
  return (
    <Container
      size="full"
      p={0}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <HeroHeader />
      <Container
        size={740}
        py="3rem"
        style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        <div style={{ flex: 1, minHeight: 0 }}>
          <AppTabs />
        </div>
      </Container>
    </Container>
  );
}
