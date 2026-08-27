"use client";

import { useMutation } from "@tanstack/react-query";
import type { OrderItem, PrepStatus } from "@/types/orders";

interface UpdatePrepStatusErrorResponse {
  message: string;
}

async function updatePrepStatusRequest(payload: {
  outletId: string;
  orderId: string;
  orderItemId: string;
  prepStatus: Extract<PrepStatus, "preparing" | "prepared">;
}): Promise<{ message: string; order_item: OrderItem }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/orders/${payload.orderId}/items/${payload.orderItemId}/prep-status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prep_status: payload.prepStatus }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdatePrepStatusErrorResponse;
    throw new Error(error.message || "Failed to update prep status");
  }

  return data;
}

export function useUpdatePrepStatus() {
  return useMutation({
    mutationFn: updatePrepStatusRequest,
  });
}
