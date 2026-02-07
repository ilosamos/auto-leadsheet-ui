import { Container, Stack } from "@mantine/core";
import { HeroHeader } from "../components/HeroHeader";
import { AppTabs } from "../components/AppTabs";

export default function HomePage() {
  return (
    <Container size={680} py="xl">
      <Stack gap="xl">
        <HeroHeader />
        <AppTabs />
      </Stack>
    </Container>
  );
}
