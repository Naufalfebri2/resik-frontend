"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAcknowledgeOrder } from "@/hooks/use-acknowledge-order";

export function AcknowledgeOrderButton({
  outletId,
  orderId,
}: {
  outletId: string;
  orderId: string;
}) {
  const router = useRouter();
  const acknowledgeOrder = useAcknowledgeOrder();

  function handleAcknowledge() {
    acknowledgeOrder.mutate(
      { outletId, orderId },
      {
        onSuccess: () => {
          toast.success("Order acknowledged");
          router.refresh();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleAcknowledge}
      disabled={acknowledgeOrder.isPending}
    >
      {acknowledgeOrder.isPending ? "Acknowledging..." : "Acknowledge"}
    </Button>
  );
}
