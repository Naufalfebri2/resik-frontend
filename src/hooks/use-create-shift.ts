"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Shift } from "@/types/hr";

interface CreateShiftPayload {
  sectionId: string;
  shift_name: string;
  start_time: string;
  end_time: string;
}

interface CreateShiftErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createShiftRequest(
  payload: CreateShiftPayload,
): Promise<{ message: string; shift: Shift }> {
  const { sectionId, ...body } = payload;

  const response = await fetch(`/api/sections/${sectionId}/shifts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateShiftErrorResponse;
    throw new Error(error.message || "Failed to create shift");
  }

  return data;
}

export function useCreateShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShiftRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}
