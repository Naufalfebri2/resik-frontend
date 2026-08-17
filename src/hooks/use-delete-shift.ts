"use client";

import { useMutation } from "@tanstack/react-query";

interface DeleteShiftPayload {
  sectionId: string;
  shiftId: string;
}

interface DeleteShiftErrorResponse {
  message: string;
}

async function deleteShiftRequest(
  payload: DeleteShiftPayload,
): Promise<{ message: string }> {
  const { sectionId, shiftId } = payload;

  const response = await fetch(`/api/sections/${sectionId}/shifts/${shiftId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteShiftErrorResponse;
    throw new Error(error.message || "Failed to delete shift");
  }

  return data;
}

export function useDeleteShift() {
  return useMutation({
    mutationFn: deleteShiftRequest,
  });
}
