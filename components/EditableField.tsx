"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Text, TextInput } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

interface EditableFieldProps {
  value: string;
  placeholder: string;
  size?: "sm" | "xs";
  fw?: number;
  c?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function EditableField({
  value,
  placeholder,
  size = "sm",
  fw,
  c,
  disabled = false,
  onSubmit,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep draft in sync with prop when not editing
  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  // Auto-focus the input when entering edit mode
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = useCallback(() => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSubmit(trimmed);
    } else {
      setDraft(value);
    }
  }, [draft, value, onSubmit]);

  if (editing) {
    return (
      <TextInput
        ref={inputRef}
        size="xs"
        variant="unstyled"
        value={draft}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => setDraft(e.currentTarget.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        styles={{
          input: {
            fontSize: size === "xs" ? "var(--mantine-font-size-xs)" : "var(--mantine-font-size-sm)",
            fontWeight: fw,
            color: c ? `var(--mantine-color-${c})` : undefined,
            padding: 0,
            height: "auto",
            minHeight: 0,
          },
        }}
      />
    );
  }

  return (
    <Group gap={4} wrap="nowrap" style={{ cursor: disabled ? "default" : "pointer" }} onClick={() => !disabled && setEditing(true)}>
      <Text size={size} fw={fw} c={c} lineClamp={1}>
        {value || placeholder}
      </Text>
      {!disabled && <IconPencil
        size={16}
        style={{ flexShrink: 0, opacity: 0.4 }}
      />}
    </Group>
  );
}
