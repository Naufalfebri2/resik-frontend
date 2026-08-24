"use client";

import { useMutation } from "@tanstack/react-query";
import type { CreateOrderPayload, Order } from "@/types/orders";

interface CreateOrderErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createOrderRequest(payload: {
  outletId: string;
  data: CreateOrderPayload;
}): Promise<{ message: string; order: Order }> {
  const response = await fetch(`/api/outlets/${payload.outletId}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.data),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateOrderErrorResponse;
    throw new Error(error.message || "Failed to create order");
  }

  return data;
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrderRequest,
  });
}
