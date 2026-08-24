"use client";

import { useMutation } from "@tanstack/react-query";
import type { Order, RefundItemPayload } from "@/types/orders";

interface RefundItemErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function refundItemRequest(payload: {
  outletId: string;
  orderId: string;
  orderItemId: string;
  data: RefundItemPayload;
}): Promise<{ message: string; order: Order }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/orders/${payload.orderId}/items/${payload.orderItemId}/refund`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as RefundItemErrorResponse;
    throw new Error(error.message || "Failed to refund item");
  }

  return data;
}

export function useRefundItem() {
  return useMutation({
    mutationFn: refundItemRequest,
  });
}
