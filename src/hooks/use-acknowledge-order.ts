"use client";

import { useMutation } from "@tanstack/react-query";
import type { Order } from "@/types/orders";

interface AcknowledgeOrderErrorResponse {
  message: string;
}

async function acknowledgeOrderRequest(payload: {
  outletId: string;
  orderId: string;
}): Promise<{ message: string; order: Order }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/orders/${payload.orderId}/acknowledge`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as AcknowledgeOrderErrorResponse;
    throw new Error(error.message || "Failed to acknowledge order");
  }

  return data;
}

export function useAcknowledgeOrder() {
  return useMutation({
    mutationFn: acknowledgeOrderRequest,
  });
}
