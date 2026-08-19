"use client";

import { useMutation } from "@tanstack/react-query";

interface DeleteSectionPayload {
  outletId: string;
  sectionId: string;
}

interface DeleteSectionErrorResponse {
  message: string;
}

async function deleteSectionRequest(
  payload: DeleteSectionPayload,
): Promise<{ message: string }> {
  const { outletId, sectionId } = payload;

  const response = await fetch(
    `/api/outlets/${outletId}/sections/${sectionId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteSectionErrorResponse;
    throw new Error(error.message || "Failed to delete section");
  }

  return data;
}

export function useDeleteSection() {
  return useMutation({
    mutationFn: deleteSectionRequest,
  });
}
