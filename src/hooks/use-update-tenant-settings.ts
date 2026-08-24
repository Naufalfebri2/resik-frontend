"use client";

import { useMutation } from "@tanstack/react-query";
import type { Tenant, UpdateTenantSettingsPayload } from "@/types/tenant";

interface UpdateTenantSettingsErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateTenantSettingsRequest(
  payload: UpdateTenantSettingsPayload,
): Promise<{ message: string; tenant: Tenant }> {
  const response = await fetch("/api/tenant/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateTenantSettingsErrorResponse;
    throw new Error(error.message || "Failed to update settings");
  }

  return data;
}

export function useUpdateTenantSettings() {
  return useMutation({
    mutationFn: updateTenantSettingsRequest,
  });
}
