"use client";

import { Container, Stack, Text, Title } from "@mantine/core";
import { HeroHeader } from "../components/HeroHeader";
import { AppTabs } from "../components/AppTabs";
import "./client/config";

export function HomePageClient() {
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
        <Stack gap="xs" mb="lg">
          <Title order={2}>Upload audio, get a draft lead sheet</Title>
          <Text c="dimmed">
            Analyze your recordings to receive chords, sections, and exportable
            MusicXML or PDF.
          </Text>
        </Stack>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AppTabs />
        </div>
      </Container>
    </Container>
  );
}
