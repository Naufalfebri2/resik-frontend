"use client";

import { useMutation } from "@tanstack/react-query";
import type { Section } from "@/types/inventory";

interface UpdateSectionPayload {
  outletId: string;
  sectionId: string;
  name: string;
}

interface UpdateSectionErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateSectionRequest(
  payload: UpdateSectionPayload,
): Promise<{ message: string; section: Section }> {
  const { outletId, sectionId, ...body } = payload;

  const response = await fetch(
    `/api/outlets/${outletId}/sections/${sectionId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateSectionErrorResponse;
    throw new Error(error.message || "Failed to update section");
  }

  return data;
}

export function useUpdateSection() {
  return useMutation({
    mutationFn: updateSectionRequest,
  });
}
