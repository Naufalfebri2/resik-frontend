"use client";

import { useMutation } from "@tanstack/react-query";
import type { AssignSplitLabelPayload, OrderItem } from "@/types/orders";

interface AssignSplitLabelErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function assignSplitLabelRequest(payload: {
  outletId: string;
  orderId: string;
  orderItemId: string;
  data: AssignSplitLabelPayload;
}): Promise<{ message: string; order_item: OrderItem }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/orders/${payload.orderId}/items/${payload.orderItemId}/split-label`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as AssignSplitLabelErrorResponse;
    throw new Error(error.message || "Failed to assign split label");
  }

  return data;
}

export function useAssignSplitLabel() {
  return useMutation({
    mutationFn: assignSplitLabelRequest,
  });
}
