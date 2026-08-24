"use client";

import { useMutation } from "@tanstack/react-query";
import type { AddOrderItemsPayload, Order } from "@/types/orders";

interface AddOrderItemsErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function addOrderItemsRequest(payload: {
  outletId: string;
  orderId: string;
  data: AddOrderItemsPayload;
}): Promise<{ message: string; order: Order }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/orders/${payload.orderId}/items`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as AddOrderItemsErrorResponse;
    throw new Error(error.message || "Failed to add items");
  }

  return data;
}

export function useAddOrderItems() {
  return useMutation({
    mutationFn: addOrderItemsRequest,
  });
}
