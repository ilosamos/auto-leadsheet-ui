"use client";

import { Container, Stack, Button } from "@mantine/core";
import { HeroHeader } from "../components/HeroHeader";
import { AppTabs } from "../components/AppTabs";
import "./client/config";
import { api } from "./client/api";
import { JobsService } from "./client/services/JobsService";
import { SongsService, UsersService } from "./client";
import { useJob } from "../providers/JobProvider";

export default function HomePage() {
  const { setCurrentJob } = useJob();

  const handleTestCall = async () => {
    const { data, error } = await api(UsersService.listMySongsUsersMeSongsGet({ limit: 10, cursor: undefined }));
    console.log("data", data);
    console.log("error", error);
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
