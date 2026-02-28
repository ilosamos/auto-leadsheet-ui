"use client";

import { Group, Paper, Text, Title } from "@mantine/core";
import { ReactNode } from "react";

type SectionHeaderCardProps = {
  title: string;
  description: string;
  action?: ReactNode;
  maxWidth?: number | string;
};

export function SectionHeaderCard({
  title,
  description,
  action,
  maxWidth = 648,
}: SectionHeaderCardProps) {
  return (
    <Paper
      withBorder
      radius="md"
      p="sm"
      shadow="xs"
      maw={maxWidth}
      bg="dark.7"
      style={{
        borderColor: "var(--mantine-color-dark-4)",
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <div style={{ minWidth: 0 }}>
          <Title order={4} lh={1.1}>
            {title}
          </Title>
          <Text size="sm" c="dimmed" lineClamp={1}>
            {description}
          </Text>
        </div>
        {action}
      </Group>
    </Paper>
  );
}
