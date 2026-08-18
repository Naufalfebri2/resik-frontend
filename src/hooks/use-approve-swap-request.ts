"use client";

import { useMutation } from "@tanstack/react-query";
import type { ShiftSwapRequest } from "@/types/hr";

interface ApproveSwapRequestErrorResponse {
  message: string;
}

async function approveSwapRequestRequest(
  swapRequestId: string,
): Promise<{ message: string; shift_swap_request: ShiftSwapRequest }> {
  const response = await fetch(
    `/api/shift-swap-requests/${swapRequestId}/approve`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApproveSwapRequestErrorResponse;
    throw new Error(error.message || "Failed to approve swap request");
  }

  return data;
}

export function useApproveSwapRequest() {
  return useMutation({
    mutationFn: approveSwapRequestRequest,
  });
}
