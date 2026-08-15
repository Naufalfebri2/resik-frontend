"use client";

import { useMutation } from "@tanstack/react-query";
import type { Supplier } from "@/types/inventory";

interface CreateSupplierPayload {
  name: string;
  contact: string;
}

interface CreateSupplierErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createSupplierRequest(
  payload: CreateSupplierPayload,
): Promise<{ message: string; supplier: Supplier }> {
  const response = await fetch("/api/suppliers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateSupplierErrorResponse;
    throw new Error(error.message || "Failed to create supplier");
  }

  return data;
}

export function useCreateSupplier() {
  return useMutation({
    mutationFn: createSupplierRequest,
  });
}
