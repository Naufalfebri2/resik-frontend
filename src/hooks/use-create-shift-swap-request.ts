"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShiftSwapRequest } from "@/types/hr";

interface CreateShiftSwapRequestPayload {
  requester_schedule_id: string;
  target_schedule_id: string;
}

interface CreateShiftSwapRequestErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createShiftSwapRequestRequest(
  payload: CreateShiftSwapRequestPayload,
): Promise<{ message: string; shift_swap_request: ShiftSwapRequest }> {
  const response = await fetch(`/api/shift-swap-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateShiftSwapRequestErrorResponse;
    throw new Error(error.message || "Failed to create swap request");
  }

  return data;
}

export function useCreateShiftSwapRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShiftSwapRequestRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-schedules"] });
    },
  });
}
