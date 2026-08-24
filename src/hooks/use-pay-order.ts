"use client";

import { useMutation } from "@tanstack/react-query";
import type { Order, PayOrderPayload } from "@/types/orders";

interface PayOrderErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function payOrderRequest(payload: {
  outletId: string;
  orderId: string;
  data: PayOrderPayload;
}): Promise<{ message: string; order: Order }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/orders/${payload.orderId}/pay`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as PayOrderErrorResponse;
    throw new Error(error.message || "Failed to process payment");
  }

  return data;
}

export function usePayOrder() {
  return useMutation({
    mutationFn: payOrderRequest,
  });
}
