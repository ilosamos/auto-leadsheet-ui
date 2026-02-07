"use client";

import { Anchor, Container, Group, Text } from "@mantine/core";

const links = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Imprint", href: "#" },
  { label: "Contact", href: "#" },
];

export function Footer() {
  return (
    <footer>
      <Container size={740} py="md">
        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed">
            &copy; {new Date().getFullYear()} Auto Leadsheet Generator
          </Text>
          <Group gap="md">
            {links.map((link) => (
              <Anchor
                key={link.label}
                href={link.href}
                size="xs"
                c="dimmed"
                underline="hover"
                onClick={(e) => e.preventDefault()}
              >
                {link.label}
              </Anchor>
            ))}
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
