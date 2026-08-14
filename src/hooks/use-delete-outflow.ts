"use client";

import { useMutation } from "@tanstack/react-query";
import type { DailyStock } from "@/types/inventory";

interface DeleteOutflowPayload {
  dailyStockId: string;
  outflowId: string;
}

interface DeleteOutflowErrorResponse {
  message: string;
}

async function deleteOutflowRequest(
  payload: DeleteOutflowPayload,
): Promise<{ message: string }> {
  const { dailyStockId, outflowId } = payload;

  const response = await fetch(
    `/api/daily-stocks/${dailyStockId}/outflows/${outflowId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteOutflowErrorResponse;
    throw new Error(error.message || "Failed to delete stock outflow");
  }

  return data;
}

export function useDeleteOutflow() {
  return useMutation({
    mutationFn: deleteOutflowRequest,
  });
}
