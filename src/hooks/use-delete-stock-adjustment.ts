"use client";

import { useMutation } from "@tanstack/react-query";

interface DeleteStockAdjustmentPayload {
  ingredientId: string;
  adjustmentId: string;
}

interface DeleteStockAdjustmentErrorResponse {
  message: string;
}

async function deleteStockAdjustmentRequest(
  payload: DeleteStockAdjustmentPayload,
): Promise<{ message: string }> {
  const { ingredientId, adjustmentId } = payload;

  const response = await fetch(
    `/api/ingredients/${ingredientId}/stock-adjustments/${adjustmentId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteStockAdjustmentErrorResponse;
    throw new Error(error.message || "Failed to delete stock adjustment");
  }

  return data;
}

export function useDeleteStockAdjustment() {
  return useMutation({
    mutationFn: deleteStockAdjustmentRequest,
  });
}
