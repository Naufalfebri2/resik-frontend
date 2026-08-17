"use client";

import { useMutation } from "@tanstack/react-query";
import type { Shift } from "@/types/hr";

interface UpdateShiftPayload {
  sectionId: string;
  shiftId: string;
  shift_name: string;
  start_time: string;
  end_time: string;
}

interface UpdateShiftErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateShiftRequest(
  payload: UpdateShiftPayload,
): Promise<{ message: string; shift: Shift }> {
  const { sectionId, shiftId, ...body } = payload;

  const response = await fetch(`/api/sections/${sectionId}/shifts/${shiftId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateShiftErrorResponse;
    throw new Error(error.message || "Failed to update shift");
  }

  return data;
}

export function useUpdateShift() {
  return useMutation({
    mutationFn: updateShiftRequest,
  });
}
