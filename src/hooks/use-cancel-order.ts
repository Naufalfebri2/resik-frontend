"use client";

import { useMutation } from "@tanstack/react-query";
import type { Order } from "@/types/orders";

interface CancelOrderErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function cancelOrderRequest(payload: {
  outletId: string;
  orderId: string;
}): Promise<{ message: string; order: Order }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/orders/${payload.orderId}/cancel-all`,
    { method: "POST" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as CancelOrderErrorResponse;
    throw new Error(error.message || "Failed to cancel order");
  }

  return data;
}

export function useCancelOrder() {
  return useMutation({
    mutationFn: cancelOrderRequest,
  });
}
