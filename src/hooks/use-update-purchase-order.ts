"use client";

import { useMutation } from "@tanstack/react-query";
import type { PurchaseOrder } from "@/types/inventory";

interface UpdatePurchaseOrderItem {
  ingredient_id: string;
  quantity: number;
  unit_price: number;
}

interface UpdatePurchaseOrderPayload {
  outletId: string;
  purchaseOrderId: string;
  supplier_id: string;
  date: string;
  items: UpdatePurchaseOrderItem[];
}

interface UpdatePurchaseOrderErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updatePurchaseOrderRequest(
  payload: UpdatePurchaseOrderPayload,
): Promise<{ message: string; purchase_order: PurchaseOrder }> {
  const { outletId, purchaseOrderId, ...body } = payload;

  const response = await fetch(
    `/api/outlets/${outletId}/purchase-orders/${purchaseOrderId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdatePurchaseOrderErrorResponse;
    throw new Error(error.message || "Failed to update purchase order");
  }

  return data;
}

export function useUpdatePurchaseOrder() {
  return useMutation({
    mutationFn: updatePurchaseOrderRequest,
  });
}
