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
import { useSession, signOut, signIn } from "next-auth/react";
import { useUser } from "../providers/AuthSessionProvider";
import { api } from "../app/client/api";
import { StripeService } from "../app/client/services/StripeService";
import { notifyError } from "../utils/notifications";

export function Header() {
  const { data: session, status } = useSession();
  const { user } = useUser();

  const userEmail = user?.email ?? session?.user?.email;
  const userName = user?.name ?? session?.user?.name;
  const userImage = user?.image ?? session?.user?.image;
  const isFreeEligible = user?.freeEligible ?? false;
  const shouldShowCredits = !isFreeEligible;
  const credits = user?.credits ?? 0;
  const handlePurchase = async (tier: "low" | "high") => {
    const { data, error } = await api(
      StripeService.createCheckoutSessionStripeCheckoutPost({ tier }),
    );

    if (error) {
      notifyError("Checkout error", "Unable to start checkout. Please try again.");
      return;
    }

    const redirectUrl = data?.url ?? null;

    if (!redirectUrl) {
      notifyError("Checkout error", "Checkout URL was not returned. Please try again.");
      return;
    }

    window.location.href = redirectUrl;
  };

  return (
    <header>
      <Container size={740} py="sm">
        <Group justify="space-between">
          <Text>leadsheet.me</Text>

          {status === "loading" && (
            <Skeleton height={28} width={100} radius="xl" />
          )}

          {status === "unauthenticated" && (
            <Button
              variant="light"
              size="xs"
              leftSection={<IconBrandGoogle size={16} />}
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </Button>
          )}

          {status === "authenticated" && session.user && (
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    {shouldShowCredits && (
                      <Text size="sm" fw={500}>
                        Credits: {credits}
                      </Text>
                    )}
                    <Avatar
                      size="sm"
                      radius="xl"
                      src={userImage}
                      alt={userName ?? "User"}
                      color="blue"
                    >
                      <IconUser size={16} />
                    </Avatar>
                    <Text size="sm" fw={500}>
                      {userName ?? "User"}
                    </Text>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{userEmail}</Menu.Label>
                <Menu.Divider />
                <Menu.Item onClick={() => handlePurchase("low")}>
                  Buy 5 Credits
                </Menu.Item>
                <Menu.Item onClick={() => handlePurchase("high")}>
                  Buy 10 Credits
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
