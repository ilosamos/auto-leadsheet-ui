"use client";

import { Tabs, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconHistory,
  IconMicrophone2,
  IconSettings,
} from "@tabler/icons-react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Analyze } from "./Analyze";
import { History } from "./History";
import { PaymentHandler } from "./PaymentHandler";

export function AppTabs() {
  const { status } = useSession();
  const [tab, setTab] = useState<string | null>("analyze");
  const isSmallScreen = useMediaQuery("(max-width: 48em)");
  const showHistory = status === "authenticated";
  const tabPanelProps = {
    pl: isSmallScreen ? "sm" : "md",
    pt: isSmallScreen ? "sm" : "0",
    keepMounted: true,
    miw: isSmallScreen ? "100%" : "648px",
    style: { height: "100%", minHeight: 0, flex: 1, minWidth: 0 },
  };

  useEffect(() => {
    if (!showHistory && tab === "history") {
      setTab("analyze");
    }
  }, [showHistory, tab]);

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
        orientation={isSmallScreen ? "horizontal" : "vertical"}
        variant="outline"
        placement={isSmallScreen ? undefined : "left"}
        style={{
          marginLeft: isSmallScreen ? 0 : -50,
          height: "100%",
          minHeight: 0,
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="analyze" leftSection={<IconMicrophone2 size={16} />}>
            Analyze
          </Tabs.Tab>
          {showHistory && (
            <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
              History
            </Tabs.Tab>
          )}
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel
          value="analyze"
          pl={isSmallScreen ? "0" : "md"}
          pt={tabPanelProps.pt}
          keepMounted={tabPanelProps.keepMounted}
          style={tabPanelProps.style}
          miw={tabPanelProps.miw}
        >
          <Analyze />
        </Tabs.Panel>

        {showHistory && (
          <Tabs.Panel
            value="history"
            {...tabPanelProps}
          >
            <History active={tab === "history"} />
          </Tabs.Panel>
        )}

        <Tabs.Panel
          value="settings"
          {...tabPanelProps}
        >
          <Text c="dimmed" size="sm">
            Settings coming soon.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
