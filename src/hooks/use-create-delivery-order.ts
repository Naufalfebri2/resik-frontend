"use client";

import { useMutation } from "@tanstack/react-query";
import type { CreateDeliveryOrderPayload, Order } from "@/types/orders";

interface CreateDeliveryOrderErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createDeliveryOrderRequest(payload: {
  outletId: string;
  data: CreateDeliveryOrderPayload;
}): Promise<{ message: string; order: Order }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/delivery-orders`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateDeliveryOrderErrorResponse;
    throw new Error(error.message || "Failed to create delivery order");
  }

  return data;
}

export function useCreateDeliveryOrder() {
  return useMutation({
    mutationFn: createDeliveryOrderRequest,
  });
}
