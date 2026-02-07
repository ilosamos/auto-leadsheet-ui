"use client";

import { Button, Center, Group, Loader, Stack, Tabs, Text } from "@mantine/core";
import {
  IconHistory,
  IconMicrophone2,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
import { useJob } from "../providers/JobProvider";
import { FileUpload } from "./FileUpload";
import { ResultList } from "./ResultList";
import { GenerateSheetButton } from "./GenerateSheetButton";

export function AppTabs() {
  const { isLoadingJob, isLoadingSongs, currentJobSongs, createJob } = useJob();
  const isLoading = isLoadingJob || isLoadingSongs;

  const finishedSongs = currentJobSongs.filter(s => s.allin1Path && s.chordsPath);

  return (
    <Tabs
      defaultValue="analyze"
      orientation="vertical"
      variant="outline"
      placement="left"
      style={{ marginLeft: -50 }}
    >
      <Tabs.List>
        <Tabs.Tab value="analyze" leftSection={<IconMicrophone2 size={16} />}>
          Analyze
        </Tabs.Tab>
        <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
          History
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="analyze" pl="md">
        {isLoading ? (
          <Center py="xl">
            <Stack align="center" gap="sm">
              <Text size="sm" c="dimmed">
                Loading data…
              </Text>
              <Loader size="md" />
            </Stack>
          </Center>
        ) : (
          <Stack gap="xl">
            <Group justify="flex-end">
              <Button
                variant="filled"
                leftSection={<IconPlus size={16} />}
                onClick={createJob}
                loading={isLoadingJob}
              >
                New Session
              </Button>
            </Group>
            <FileUpload />
            {currentJobSongs.length > 0 && (
              <GenerateSheetButton
                songs={currentJobSongs}
                loading={false}
                loadingText="This may take a few minutes"
                onGenerate={() => {
                  // TODO: wire up actual sheet generation
                }}
              />
            )}
            <ResultList songs={finishedSongs} />
          </Stack>
        )}
      </Tabs.Panel>

      <Tabs.Panel value="history" pl="md">
        <Text c="dimmed" size="sm">
          Your previous analyses will appear here.
        </Text>
      </Tabs.Panel>

      <Tabs.Panel value="settings" pl="md">
        <Text c="dimmed" size="sm">
          Settings coming soon.
        </Text>
      </Tabs.Panel>
    </Tabs>
  );
}
