import { useEffect, useState } from "react";
import {
  Title,
  Text,
  Stack,
  Container,
  Box,
  Group,
  Alert,
  Button,
  Badge,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ExampleCard } from "./ExampleCard";
import { IconInfoCircle } from "@tabler/icons-react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { SMALL_SCREEN_QUERY } from "../utils/breakpoints";
import { useSession } from "next-auth/react";

export function HeroHeader() {
  const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY);
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsCollapsed(isLoggedIn);
  }, [isLoggedIn]);

  const expandedHeight = isSmallScreen ? 310 : 420;
  const collapsedHeight = 72;
  const targetHeight = isLoggedIn && isCollapsed ? collapsedHeight : expandedHeight;
  const toggleLabel = isCollapsed ? "Expand header" : "Collapse header";

  return (
    <Box
      component="section"
      style={{
        position: "relative",
        overflow: "hidden",
        height: targetHeight,
        transition: "height 250ms ease",
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
          background: [
            "radial-gradient(70% 120% at 100% 0%, rgba(72, 146, 255, 0.24), transparent 55%)",
            "radial-gradient(90% 120% at 0% 100%, rgba(162, 89, 255, 0.16), transparent 60%)",
            "linear-gradient(180deg, rgba(8, 8, 16, 0.58) 0%, rgba(8, 8, 16, 0.38) 60%, rgba(8, 8, 16, 0.62) 100%)",
          ].join(", "),
        }}
      />

      <Container
        size="full"
        h="100%"
        style={{ position: "relative" }}
      >
        <Box
          style={{
            position: "absolute",
            inset: 0,
            height: expandedHeight,
            opacity: isLoggedIn && isCollapsed ? 0 : 1,
            transition: "opacity 220ms ease",
            pointerEvents: isLoggedIn && isCollapsed ? "none" : "auto",
            willChange: "opacity",
            zIndex: 1,
          }}
        >
          <Container size="full" h={expandedHeight} py="lg">
            <Group justify="center" align="center" h="100%" gap="100">
              <Stack align="left" justify="center" gap="xs" h="100%" maw={630}>
                <Badge
                  variant="light"
                  color="blue"
                  radius="sm"
                  w="fit-content"
                  style={{ backdropFilter: "blur(3px)" }}
                >
                  AI song-to-sheet helper
                </Badge>
                <Title order={1} ta="left" c="white" fz="2.5rem">
                  Turn your recordings into lead sheets
                </Title>
                <Text c="gray.2" size="lg" ta="left" maw={520}>
                  Upload a song, get chords and structure, then export to MusicXML or PDF in just a few clicks.
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
                      Works best with clearly structured songs in popular genres.
                    </Alert>
                    <Alert
                      variant="light"
                      color="yellow"
                      p="xs"
                      radius="md"
                      icon={<IconInfoCircle size={18} />}
                    >
                      Treat generated sheets as a strong first draft and refine where needed.
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

        {isLoggedIn && (
          <Button
            variant="subtle"
            color="gray.2"
            leftSection={isCollapsed ? <IconChevronDown size={16} /> : <IconChevronUp size={16} />}
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={toggleLabel}
            style={{
              position: "absolute",
              left: "50%",
              bottom: 10,
              transform: "translateX(-50%)",
              zIndex: 5,
              opacity: 0.62,
            }}
          >
            {isCollapsed ? "Show header" : "Hide header"}
          </Button>
        )}
      </Container>
    </Box>
  );
}
