"use client";

import { useMutation } from "@tanstack/react-query";

interface DeletePurchaseOrderPayload {
  outletId: string;
  purchaseOrderId: string;
}

interface DeletePurchaseOrderErrorResponse {
  message: string;
}

async function deletePurchaseOrderRequest(
  payload: DeletePurchaseOrderPayload,
): Promise<{ message: string }> {
  const { outletId, purchaseOrderId } = payload;

  const response = await fetch(
    `/api/outlets/${outletId}/purchase-orders/${purchaseOrderId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeletePurchaseOrderErrorResponse;
    throw new Error(error.message || "Failed to delete purchase order");
  }

  return data;
}

export function useDeletePurchaseOrder() {
  return useMutation({
    mutationFn: deletePurchaseOrderRequest,
  });
}
