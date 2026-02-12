"use client";

import { Tabs, Text } from "@mantine/core";
import {
  IconHistory,
  IconMicrophone2,
  IconSettings,
} from "@tabler/icons-react";
import { Suspense, useCallback, useState } from "react";
import { Analyze } from "./Analyze";
import { History } from "./History";
import { PaymentHandler } from "./PaymentHandler";

export function AppTabs() {
  const [tab, setTab] = useState<string | null>("analyze");

  const handleTabChange = useCallback(
    (next: string | null) => {
      // Prevent "re-selecting" the current tab from causing re-renders / refreshes.
      if (next === tab) { return; }
      setTab(next);
    },
    [tab],
  );

  return (
    <>
      <Suspense fallback={null}>
        <PaymentHandler />
      </Suspense>
      <Tabs
        value={tab}
        onChange={handleTabChange}
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

        <Tabs.Panel value="analyze" pl="md" keepMounted>
          <Analyze />
        </Tabs.Panel>

        <Tabs.Panel value="history" pl="md" keepMounted>
          <History active={tab === "history"} />
        </Tabs.Panel>

        <Tabs.Panel value="settings" pl="md" keepMounted>
          <Text c="dimmed" size="sm">
            Settings coming soon.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
