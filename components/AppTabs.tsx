"use client";

import { Stack, Tabs, Text } from "@mantine/core";
import {
  IconHistory,
  IconMicrophone2,
  IconSettings,
} from "@tabler/icons-react";
import { FileUpload } from "./FileUpload";
import { ResultList } from "./ResultList";

export function AppTabs() {
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
        <Stack gap="xl">
          <FileUpload />
          <ResultList />
        </Stack>
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
