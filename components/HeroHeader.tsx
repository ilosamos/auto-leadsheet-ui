import { Title, Text, Stack, Container, Box, Group, Alert } from "@mantine/core";
import { ExampleCard } from "./ExampleCard";
import { IconInfoCircle } from "@tabler/icons-react";

export function HeroHeader() {
  return (
    <Box
      component="section"
      style={{
        position: "relative",
        overflow: "hidden",
        height: 400,
      }}
    >
      {/* Background image layer (blurred) */}
      <Box
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "blur(14px)",
          transform: "scale(1.08)", // prevent blur edges
          opacity: 0.5,
        }}
      />

      {/* Dark overlay for contrast */}
      <Box
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <Container size="full" h="100%" py="lg" style={{ position: "relative" }}>
        <Group justify="center" align="center" h="100%" gap="xl">
          <Stack align="left" justify="center" gap="xs" h="100%" w={520}>
            <Title order={1} ta="left" c="white" fz="2.5rem">
              Generate lead sheets from audio files
            </Title>
            <Text c="gray.2" size="lg" ta="left" maw={520}>
              Upload your audio files and get lead sheets with chords, segments and more — exported as MusicXML and PDF.
            </Text>
            <Alert variant="light" color="blue" p="xs" radius="md" icon={<IconInfoCircle size={18} />}>
              Works best with simple structured songs of popular genres.
            </Alert>
          </Stack>
          <ExampleCard 
            title="Frisch Kocht - Rastatronics"
            description="Lead sheet for reggae song generated from audio file."
            image="/frischkocht.png"
          />
          <ExampleCard 
            title="meta mochn - ams & Wiener Blond"
            description="Lead sheet for pop song generated from audio file."
            image="/metamochn.png"
          />
        </Group>
      </Container>
    </Box>
  );
}
