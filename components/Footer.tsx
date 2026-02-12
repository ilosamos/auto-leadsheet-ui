"use client";

import Link from "next/link";
import { Anchor, Container, Group, Text } from "@mantine/core";

const links = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Imprint", href: "/imprint" },
  { label: "Contact", href: "mailto:office@leadsheet-app.com" },
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
                component={Link}
                href={link.href}
                size="xs"
                c="dimmed"
                underline="hover"
                onClick={
                  link.href === "#" ? (e) => e.preventDefault() : undefined
                }
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
