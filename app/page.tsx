"use client";

import { Container } from "@mantine/core";
import { HeroHeader } from "../components/HeroHeader";
import { AppTabs } from "../components/AppTabs";
import "./client/config";

export default function HomePage() {
  return (
    <Container size="full" p={0}>
      <HeroHeader />
      <Container size={740} py="3rem">
        <AppTabs />
      </Container>
    </Container>
  );
}
