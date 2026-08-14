"use client";

import { useMutation } from "@tanstack/react-query";
import type { DailyStock, StockAdjustment } from "@/types/inventory";

interface CreateStockAdjustmentPayload {
  ingredientId: string;
  date: string;
  adjustment_quantity: number;
  reason: string;
}

interface CreateStockAdjustmentErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createStockAdjustmentRequest(
  payload: CreateStockAdjustmentPayload,
): Promise<{
  message: string;
  stock_adjustment: StockAdjustment;
  daily_stock: DailyStock;
}> {
  const { ingredientId, ...body } = payload;

  const response = await fetch(
    `/api/ingredients/${ingredientId}/stock-adjustments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateStockAdjustmentErrorResponse;
    throw new Error(error.message || "Failed to create stock adjustment");
  }

  return data;
}

export function useCreateStockAdjustment() {
  return useMutation({
    mutationFn: createStockAdjustmentRequest,
  });
}
