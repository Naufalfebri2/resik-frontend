"use client";

import { useMutation } from "@tanstack/react-query";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/types/inventory";

interface UpdatePurchaseOrderStatusPayload {
  outletId: string;
  purchaseOrderId: string;
  status: PurchaseOrderStatus;
  cash_account_id?: string;
  date?: string;
}

interface UpdatePurchaseOrderStatusErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updatePurchaseOrderStatusRequest(
  payload: UpdatePurchaseOrderStatusPayload,
): Promise<{ message: string; purchase_order: PurchaseOrder }> {
  const { outletId, purchaseOrderId, ...body } = payload;

  const response = await fetch(
    `/api/outlets/${outletId}/purchase-orders/${purchaseOrderId}/status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdatePurchaseOrderStatusErrorResponse;
    throw new Error(error.message || "Failed to update purchase order status");
  }

  return data;
}

export function useUpdatePurchaseOrderStatus() {
  return useMutation({
    mutationFn: updatePurchaseOrderStatusRequest,
  });
}
