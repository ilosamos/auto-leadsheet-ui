"use client";

import { Container, Stack, Button } from "@mantine/core";
import { HeroHeader } from "../components/HeroHeader";
import { AppTabs } from "../components/AppTabs";

export default function HomePage() {

  const handleTestCall = () => {
    console.log("Test call");
  };

  return (
    <Container size={740} py="xl">
      <Button onClick={handleTestCall}>TestCall</Button>
      <Stack gap="xl">
        <HeroHeader />
        <AppTabs />
      </Stack>
    </Container>
  );
}
