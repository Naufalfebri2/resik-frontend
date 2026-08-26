"use client";

import { useMutation } from "@tanstack/react-query";
import type { Outlet, UpdateOutletPayload } from "@/types/inventory";

interface UpdateOutletErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateOutletRequest(payload: {
  outletId: string;
  data: UpdateOutletPayload;
}): Promise<{ message: string; outlet: Outlet }> {
  const response = await fetch(`/api/outlets/${payload.outletId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.data),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateOutletErrorResponse;
    throw new Error(error.message || "Failed to update outlet");
  }

  return data;
}

export function useUpdateOutlet() {
  return useMutation({
    mutationFn: updateOutletRequest,
  });
}
