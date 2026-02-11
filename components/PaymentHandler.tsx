"use client";

import { Button, Group, Modal, Text } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function PaymentHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [paymentStatus, setPaymentStatus] = useState<"success" | "cancel" | null>(null);
  const normalizedPaymentStatus = useMemo(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled") ?? searchParams.get("cancelled");
    const status = searchParams.get("status");

    if (success === "true" || success === "1" || status === "success") {
      return "success";
    }
    if (canceled === "true" || canceled === "1" || status === "cancel") {
      return "cancel";
    }
    return null;
  }, [searchParams]);

  const clearPaymentParams = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    ["success", "canceled", "cancelled", "status", "session_id"].forEach((key) => {
      nextParams.delete(key);
    });
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (normalizedPaymentStatus) {
      setPaymentStatus(normalizedPaymentStatus);
    }
  }, [normalizedPaymentStatus]);

  return (
    <Modal
      opened={paymentStatus !== null}
      onClose={() => {
        setPaymentStatus(null);
        clearPaymentParams();
      }}
      title={paymentStatus === "success" ? "Payment successful" : "Payment failed"}
      centered
    >
      <Text size="sm" c="dimmed" mb="md">
        {paymentStatus === "success"
          ? "Thanks for your purchase. Your credits will be available shortly."
          : "Your payment was cancelled or failed. Please try again."}
      </Text>
      <Group justify="flex-end">
        <Button
          variant="filled"
          onClick={() => {
            setPaymentStatus(null);
            clearPaymentParams();
          }}
        >
          Close
        </Button>
      </Group>
    </Modal>
  );
}
