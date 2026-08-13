"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  DailyStock,
  StockOutflow,
  StockOutflowCategory,
} from "@/types/inventory";

interface CreateOutflowPayload {
  dailyStockId: string;
  category: StockOutflowCategory;
  quantity: number;
}

interface CreateOutflowErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createOutflowRequest(
  payload: CreateOutflowPayload,
): Promise<{
  message: string;
  stock_outflow: StockOutflow;
  daily_stock: DailyStock;
}> {
  const { dailyStockId, ...body } = payload;

  const response = await fetch(`/api/daily-stocks/${dailyStockId}/outflows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateOutflowErrorResponse;
    throw new Error(error.message || "Failed to record stock outflow");
  }

  return data;
}

export function useCreateOutflow() {
  return useMutation({
    mutationFn: createOutflowRequest,
  });
}
