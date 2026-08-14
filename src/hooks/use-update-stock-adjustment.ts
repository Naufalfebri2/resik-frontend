"use client";

import { useMutation } from "@tanstack/react-query";
import type { DailyStock, StockAdjustment } from "@/types/inventory";

interface UpdateStockAdjustmentPayload {
  ingredientId: string;
  adjustmentId: string;
  adjustment_quantity: number;
  reason: string;
}

interface UpdateStockAdjustmentErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateStockAdjustmentRequest(
  payload: UpdateStockAdjustmentPayload,
): Promise<{
  message: string;
  stock_adjustment: StockAdjustment;
  daily_stock: DailyStock | null;
}> {
  const { ingredientId, adjustmentId, ...body } = payload;

  const response = await fetch(
    `/api/ingredients/${ingredientId}/stock-adjustments/${adjustmentId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateStockAdjustmentErrorResponse;
    throw new Error(error.message || "Failed to update stock adjustment");
  }

  return data;
}

export function useUpdateStockAdjustment() {
  return useMutation({
    mutationFn: updateStockAdjustmentRequest,
  });
}
