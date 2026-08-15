"use client";

import { useMutation } from "@tanstack/react-query";

interface DeleteSupplierPayload {
  supplierId: string;
}

interface DeleteSupplierErrorResponse {
  message: string;
}

async function deleteSupplierRequest(
  payload: DeleteSupplierPayload,
): Promise<{ message: string }> {
  const response = await fetch(`/api/suppliers/${payload.supplierId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteSupplierErrorResponse;
    throw new Error(error.message || "Failed to delete supplier");
  }

  return data;
}

export function useDeleteSupplier() {
  return useMutation({
    mutationFn: deleteSupplierRequest,
  });
}
