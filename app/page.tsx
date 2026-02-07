"use client";

import { Container, Stack, Button } from "@mantine/core";
import { HeroHeader } from "../components/HeroHeader";
import { AppTabs } from "../components/AppTabs";
import "./client/config";
import { api } from "./client/api";
import { JobsService } from "./client/services/JobsService";
import { SongsService } from "./client";

export default function HomePage() {
  const handleTestCall = async () => {
    const { data, error } = await api(
      SongsService.getSongDetailsJobsJobIdSongsSongIdGet({
        jobId: "20b47336-b063-4502-b3f4-2358cc235084",
        songId: "a17c30a3-6077-4d12-9de1-cd9e35c77f7c"
      })
    );

    if (error) {
      // eslint-disable-next-line no-console
      console.error("API call failed:", error);
      return;
    }

    // eslint-disable-next-line no-console
    console.log("Job details:", data);
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
