import { Title, Text, Stack, Container, Box, Group, Alert } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ExampleCard } from "./ExampleCard";
import { IconInfoCircle } from "@tabler/icons-react";
import { SMALL_SCREEN_QUERY } from "../utils/breakpoints";

export function HeroHeader() {
  const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY);

  return (
    <Box
      component="section"
      style={{
        position: "relative",
        overflow: "hidden",
          height: isSmallScreen ? 290 : 400,
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
        <Group justify="center" align="center" h="100%" gap="100">
          <Stack align="left" justify="center" gap="xs" h="100%" maw={630}>
            <Title order={1} ta="left" c="white" fz="2.5rem">
              Generate lead sheets from your own audio files
            </Title>
            <Text c="gray.2" size="lg" ta="left" maw={520}>
              Upload your songs and get lead sheets with chords, segments and more — exported as MusicXML and PDF.
            </Text>
            {!isSmallScreen && (
              <>
                <Alert
                  variant="light"
                  color="blue"
                  p="xs"
                  radius="md"
                  icon={<IconInfoCircle size={18} />}
                >
                  Works best with simple structured songs of popular genres.
                </Alert>
                <Alert
                  variant="light"
                  color="yellow"
                  p="xs"
                  radius="md"
                  icon={<IconInfoCircle size={18} />}
                >
                  Use sheets as drafts rather than final versions.
                </Alert>
              </>
            )}
          </Stack>
          <ExampleCard 
            title="Frisch Kocht - Rastatronics"
            description="Lead sheet for reggae song generated from audio file."
            image="/frischkocht.png"
            downloadUrl="/frisch-kocht.pdf"
          />
        </Group>
      </Container>
    </Box>
  );
}
