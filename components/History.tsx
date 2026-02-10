"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Group, Paper, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import type { SongResponse } from "../app/client";
import { UsersService } from "../app/client";
import { api } from "../app/client/api";
import { useUser } from "../providers/AuthSessionProvider";
import { ResultItem } from "./ResultItem";

type HistoryProps = {
  active: boolean;
  pageSize?: number;
};

export function History({ active, pageSize = 5 }: HistoryProps) {
  const { user } = useUser();

  const [songs, setSongs] = useState<SongResponse[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null | undefined>(undefined);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const lastUserIdRef = useRef<string | null>(null);
  const generationRef = useRef(0);
  const hasAutoLoadedOnceRef = useRef(false);

  const hasMore = useMemo(() => {
    return typeof nextCursor === "string" && nextCursor.length > 0;
  }, [nextCursor]);

  const refresh = useCallback(async () => {
    const generationAtStart = generationRef.current;
    setError(null);
    setSongs([]);
    setNextCursor(undefined);
    setIsLoadingMore(false);
    setIsLoadingInitial(true);

    const { data, error: err } = await api(
      UsersService.listMySongsUsersMeSongsGet({ limit: pageSize, cursor: undefined }),
    );

    // If a newer refresh happened while we were loading, ignore stale results.
    if (generationAtStart !== generationRef.current) {
      setIsLoadingInitial(false);
      return;
    }

    if (err) {
      setError(err);
      setIsLoadingInitial(false);
      return;
    }

    setSongs(data.songs);
    setNextCursor(data.nextCursor);
    setIsLoadingInitial(false);
  }, [pageSize]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    if (isLoadingMore) return;

    const generationAtStart = generationRef.current;
    setError(null);
    setIsLoadingMore(true);

    const { data, error: err } = await api(
      UsersService.listMySongsUsersMeSongsGet({ limit: pageSize, cursor: nextCursor }),
    );

    // If a newer refresh happened while we were loading, ignore stale results.
    if (generationAtStart !== generationRef.current) {
      setIsLoadingMore(false);
      return;
    }

    if (err) {
      setError(err);
      setIsLoadingMore(false);
      return;
    }

    setSongs((prev) => [...prev, ...data.songs]);
    setNextCursor(data.nextCursor);
    setIsLoadingMore(false);
  }, [hasMore, isLoadingMore, nextCursor, pageSize]);

  // Reset if authenticated user changes.
  useEffect(() => {
    const userId = user?.id ?? null;
    if (lastUserIdRef.current === null) {
      lastUserIdRef.current = userId;
      return;
    }
    if (lastUserIdRef.current !== userId) {
      lastUserIdRef.current = userId;
      generationRef.current += 1;
      hasAutoLoadedOnceRef.current = false;
      setSongs([]);
      setNextCursor(undefined);
      setError(null);
      setIsLoadingInitial(false);
      setIsLoadingMore(false);
    }
  }, [user?.id]);

  // Auto-load only if active and no data yet.
  useEffect(() => {
    if (!active) return;
    if (songs.length > 0) return;
    if (isLoadingInitial) return;
    if (error !== null) return;
    if (hasAutoLoadedOnceRef.current) return;
    hasAutoLoadedOnceRef.current = true;
    generationRef.current += 1;
    void refresh();
    // Intentionally depend on state so we don't miss the "became active while empty" case.
  }, [active, error, isLoadingInitial, refresh, songs.length]);

  if (!active && songs.length === 0) {
    return null;
  }

  return (
    // Fixed-height panel: header stays anchored, list scrolls inside.
    <Stack gap="md" pb="xs" style={{ height: "57vh" }}>
      <Paper withBorder radius="md" p="sm" shadow="xs" maw="648" bg="gray.9">
        <Group justify="space-between" align="center" wrap="nowrap">
          <div style={{ minWidth: 0 }}>
            <Title order={4} lh={1.1}>
              History
            </Title>
            <Text size="sm" c="dimmed" lineClamp={1}>
              Your previous analyses, newest first.
            </Text>
          </div>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconRefresh size={16} />}
            loading={isLoadingInitial}
            onClick={() => {
              hasAutoLoadedOnceRef.current = true;
              generationRef.current += 1;
              void refresh();
            }}
          >
            Refresh
          </Button>
        </Group>
      </Paper>

      {error && (
        <Group justify="space-between" align="center">
          <Text size="sm" c="red">
            Failed to load songs. Please try again.
          </Text>
          <Text size="sm" c="dimmed">
            Use the Refresh button above.
          </Text>
        </Group>
      )}

      <ScrollArea
        type="always"
        offsetScrollbars
        scrollbarSize={10}
        style={{ flex: 1 }}
      >
        <Stack gap="sm" pr="sm" pb="xs">
          {!error && !isLoadingInitial && songs.length === 0 ? (
            <Text size="sm" c="dimmed">
              No songs yet.
            </Text>
          ) : (
            songs.map((s) => <ResultItem key={s.songId} song={s} />)
          )}

          {hasMore && (
            <Group justify="center" pt="xs">
              <Button onClick={loadMore} loading={isLoadingMore} variant="light">
                Load more
              </Button>
            </Group>
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}

