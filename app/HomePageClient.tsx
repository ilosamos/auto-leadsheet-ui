"use client";

import { Container, Stack, Text, Title } from "@mantine/core";
import { HeroHeader } from "../components/HeroHeader";
import { AppTabs } from "../components/AppTabs";
import "./client/config";
import { useMediaQuery } from "@mantine/hooks";
import { SMALL_SCREEN_QUERY } from "../utils/breakpoints";

export function HomePageClient() {
  const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY);
  
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
        <Stack gap="xs" mb="lg" pl={isSmallScreen ? "0" : "145"}>
          <Title order={2}>Upload audio, get a lead sheet</Title>
          <Text c="dimmed">
            Fast, friendly analysis for exporting your song ideas to MusicXML or PDF.
          </Text>
        </Stack>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AppTabs />
        </div>
      </Container>
    </Container>
  );
}
