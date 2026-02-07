"use client";

import {
  Avatar,
  Button,
  Container,
  Group,
  Menu,
  Skeleton,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconBrandGoogle, IconLogout, IconUser } from "@tabler/icons-react";
import { useSession, signOut } from "next-auth/react";
import { triggerGooglePrompt } from "./GoogleOneTap";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header>
      <Container size={740} py="sm">
        <Group justify="space-between">
          <Text>Auto Leadsheet</Text>

          {status === "loading" && (
            <Skeleton height={28} width={100} radius="xl" />
          )}

          {status === "unauthenticated" && (
            <Button
              variant="light"
              size="xs"
              leftSection={<IconBrandGoogle size={16} />}
              onClick={() => triggerGooglePrompt()}
            >
              Sign in with Google
            </Button>
          )}

          {status === "authenticated" && session.user && (
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar
                      size="sm"
                      radius="xl"
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      color="blue"
                    >
                      <IconUser size={16} />
                    </Avatar>
                    <Text size="sm" fw={500}>
                      {session.user.name ?? "User"}
                    </Text>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{session.user.email}</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />}>
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={() => signOut()}
                >
                  Log out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>
    </header>
  );
}
