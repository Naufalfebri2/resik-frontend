"use client";

import { useMutation } from "@tanstack/react-query";
import type { ShiftSwapRequest } from "@/types/hr";

interface RejectSwapRequestErrorResponse {
  message: string;
}

async function rejectSwapRequestRequest(
  swapRequestId: string,
): Promise<{ message: string; shift_swap_request: ShiftSwapRequest }> {
  const response = await fetch(
    `/api/shift-swap-requests/${swapRequestId}/reject`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as RejectSwapRequestErrorResponse;
    throw new Error(error.message || "Failed to reject swap request");
  }

  return data;
}

export function useRejectSwapRequest() {
  return useMutation({
    mutationFn: rejectSwapRequestRequest,
  });
}
