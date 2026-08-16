"use client";

import { useMutation } from "@tanstack/react-query";
import type { PurchaseOrder } from "@/types/inventory";

interface CreatePurchaseOrderItem {
  ingredient_id: string;
  quantity: number;
  unit_price: number;
}

interface CreatePurchaseOrderPayload {
  outletId: string;
  supplier_id: string;
  date: string;
  items: CreatePurchaseOrderItem[];
}

interface CreatePurchaseOrderErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createPurchaseOrderRequest(
  payload: CreatePurchaseOrderPayload,
): Promise<{ message: string; purchase_order: PurchaseOrder }> {
  const { outletId, ...body } = payload;

  const response = await fetch(`/api/outlets/${outletId}/purchase-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreatePurchaseOrderErrorResponse;
    throw new Error(error.message || "Failed to create purchase order");
  }

  return data;
}

export function useCreatePurchaseOrder() {
  return useMutation({
    mutationFn: createPurchaseOrderRequest,
  });
}
