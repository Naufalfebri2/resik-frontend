"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useApproveSwapRequest } from "@/hooks/use-approve-swap-request";
import { useRejectSwapRequest } from "@/hooks/use-reject-swap-request";
import type { ShiftSwapRequest } from "@/types/hr";

export function SwapRequestRowActions({
  swapRequest,
}: {
  swapRequest: ShiftSwapRequest;
}) {
  const router = useRouter();
  const approveSwapRequest = useApproveSwapRequest();
  const rejectSwapRequest = useRejectSwapRequest();

  function handleApprove() {
    approveSwapRequest.mutate(swapRequest.id, {
      onSuccess: () => {
        router.refresh();
        toast.success("Swap request approved successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  function handleReject() {
    rejectSwapRequest.mutate(swapRequest.id, {
      onSuccess: () => {
        router.refresh();
        toast.success("Swap request rejected");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  const isPending = approveSwapRequest.isPending || rejectSwapRequest.isPending;

  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" onClick={handleApprove} disabled={isPending}>
        {approveSwapRequest.isPending ? "Approving..." : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-destructive hover:text-destructive"
        onClick={handleReject}
        disabled={isPending}
      >
        {rejectSwapRequest.isPending ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
}
