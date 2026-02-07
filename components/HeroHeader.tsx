import { Title, Text, Stack } from "@mantine/core";

export function HeroHeader() {
  return (
    <Stack align="center" gap="xs">
      <Title order={1} ta="center">
        Auto Leadsheet Generator
      </Title>
      <Text c="dimmed" size="lg" ta="center" maw={520}>
        Upload your audio files and instantly get lead sheets with chords and
        melody — exported as MusicXML and PDF.
      </Text>
    </Stack>
  );
}
