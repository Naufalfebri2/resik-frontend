"use client";

import { useMutation } from "@tanstack/react-query";
import type { Section } from "@/types/inventory";

interface CreateSectionPayload {
  outletId: string;
  name: string;
}

interface CreateSectionErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createSectionRequest(
  payload: CreateSectionPayload,
): Promise<{ message: string; section: Section }> {
  const { outletId, ...body } = payload;

  const response = await fetch(`/api/outlets/${outletId}/sections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateSectionErrorResponse;
    throw new Error(error.message || "Failed to create section");
  }

  return data;
}

export function useCreateSection() {
  return useMutation({
    mutationFn: createSectionRequest,
  });
}
