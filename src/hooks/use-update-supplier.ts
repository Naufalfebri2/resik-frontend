"use client";

import { useMutation } from "@tanstack/react-query";
import type { Supplier } from "@/types/inventory";

interface UpdateSupplierPayload {
  supplierId: string;
  name: string;
  contact: string;
}

interface UpdateSupplierErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateSupplierRequest(
  payload: UpdateSupplierPayload,
): Promise<{ message: string; supplier: Supplier }> {
  const { supplierId, ...body } = payload;

  const response = await fetch(`/api/suppliers/${supplierId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateSupplierErrorResponse;
    throw new Error(error.message || "Failed to update supplier");
  }

  return data;
}

export function useUpdateSupplier() {
  return useMutation({
    mutationFn: updateSupplierRequest,
  });
}
