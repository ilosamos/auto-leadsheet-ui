import { Card, Image, Group, Text, Badge, Box, Button } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";

interface ExampleCardProps {
  title: string;
  description: string;
  image: string;
  downloadUrl: string;
}

export function ExampleCard({ title, description, image, downloadUrl }: ExampleCardProps) {
  return (
    <Box style={{ position: "relative" }}>
      <Badge
        variant="filled"
        size="sm"
        color="pink"
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        Sample
      </Badge>

      <Card shadow="sm" padding="lg" radius="md" withBorder w={245}>
        <Card.Section style={{ position: "relative" }}>
          <Image
            src={image}
            height={160}
            alt={title}
            fit="cover"
            style={{ objectPosition: "top" }}
          />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="0">
          <Text fw={500}>{title}</Text>
        </Group>

        <Text size="sm" c="dimmed">
          {description}
        </Text>

        <Button
          component="a"
          href={downloadUrl}
          download
          size="xs"
          variant="light"
          mt="sm"
          color="red"
          leftSection={<IconFileTypePdf size={16} />}
        >
          Download Sample
        </Button>
      </Card>
    </Box>
  );
}