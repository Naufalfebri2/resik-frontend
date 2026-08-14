"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  DailyStock,
  StockOutflow,
  StockOutflowCategory,
} from "@/types/inventory";

interface UpdateOutflowPayload {
  dailyStockId: string;
  outflowId: string;
  category: StockOutflowCategory;
  quantity: number;
}

interface UpdateOutflowErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateOutflowRequest(
  payload: UpdateOutflowPayload,
): Promise<{
  message: string;
  stock_outflow: StockOutflow;
  daily_stock: DailyStock;
}> {
  const { dailyStockId, outflowId, ...body } = payload;

  const response = await fetch(
    `/api/daily-stocks/${dailyStockId}/outflows/${outflowId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateOutflowErrorResponse;
    throw new Error(error.message || "Failed to update stock outflow");
  }

  return data;
}

export function useUpdateOutflow() {
  return useMutation({
    mutationFn: updateOutflowRequest,
  });
}
