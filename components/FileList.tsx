"use client";

import { Accordion, Stack, Text } from "@mantine/core";
import { IconFiles } from "@tabler/icons-react";
import { FileItem, type UploadedFile } from "./FileItem";

interface FileListProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  const doneCount = files.filter((f) => f.status === "done").length;

  return (
    <Accordion defaultValue="files" variant="contained" radius="md">
      <Accordion.Item value="files">
        <Accordion.Control icon={<IconFiles size={20} />}>
          <Text size="sm" fw={500}>
            Files ({doneCount}/{files.length} completed)
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="xs">
            {files.map((f) => (
              <FileItem key={f.id} uploadedFile={f} onRemove={onRemove} />
            ))}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
