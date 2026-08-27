"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUpdateCourierStatus } from "@/hooks/use-update-courier-status";
import type { CourierStatus } from "@/types/orders";

const COURIER_NEXT: Record<
  CourierStatus,
  { target: "prepared" | "picked_up_by_courier"; label: string } | null
> = {
  pending: { target: "prepared", label: "Mark Prepared" },
  prepared: { target: "picked_up_by_courier", label: "Mark Picked Up" },
  picked_up_by_courier: null,
};

export function CourierStatusButton({
  outletId,
  orderId,
  courierStatus,
}: {
  outletId: string;
  orderId: string;
  courierStatus: CourierStatus;
}) {
  const router = useRouter();
  const updateCourierStatus = useUpdateCourierStatus();

  const next = COURIER_NEXT[courierStatus];

  if (!next) {
    return null;
  }

  function handleClick() {
    if (!next) return;

    updateCourierStatus.mutate(
      { outletId, orderId, data: { courier_status: next.target } },
      {
        onSuccess: () => {
          toast.success(`Order marked as ${next.target.replace(/_/g, " ")}`);
          router.refresh();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleClick}
      disabled={updateCourierStatus.isPending}
    >
      {updateCourierStatus.isPending ? "Updating..." : next.label}
    </Button>
  );
}
