"use client";

import { Container, Stack, Button } from "@mantine/core";
import { HeroHeader } from "../components/HeroHeader";
import { AppTabs } from "../components/AppTabs";
import "./client/config";
import { api } from "./client/api";
import { JobsService } from "./client/services/JobsService";
import { SongsService } from "./client";
import { useJob } from "../providers/JobProvider";

export default function HomePage() {
  const { setCurrentJob } = useJob();

  const handleTestCall = async () => {
    setCurrentJob("20b47336-b063-4502-b3f4-2358cc235084");
  };

  return (
    <Container size={740} py="xl">
      <Button onClick={handleTestCall}>Test: Create Job</Button>
      <Stack gap="xl">
        <HeroHeader />
        <AppTabs />
      </Stack>
    </Container>
  );
}
