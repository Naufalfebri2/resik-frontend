"use client";

import { useMutation } from "@tanstack/react-query";
import type { Order, UpdateCourierStatusPayload } from "@/types/orders";

interface UpdateCourierStatusErrorResponse {
  message: string;
}

async function updateCourierStatusRequest(payload: {
  outletId: string;
  orderId: string;
  data: UpdateCourierStatusPayload;
}): Promise<{ message: string; order: Order }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/delivery-orders/${payload.orderId}/courier-status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateCourierStatusErrorResponse;
    throw new Error(error.message || "Failed to update courier status");
  }

  return data;
}

export function useUpdateCourierStatus() {
  return useMutation({
    mutationFn: updateCourierStatusRequest,
  });
}
