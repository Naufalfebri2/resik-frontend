"use client";

import { useMutation } from "@tanstack/react-query";
import type { DailyStock } from "@/types/inventory";

interface CloseDailyStockPayload {
  dailyStockId: string;
  actual_closing_stock: number;
}

interface CloseDailyStockErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function closeDailyStockRequest(
  payload: CloseDailyStockPayload,
): Promise<{ message: string; daily_stock: DailyStock }> {
  const { dailyStockId, ...body } = payload;

  const response = await fetch(`/api/daily-stocks/${dailyStockId}/close`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CloseDailyStockErrorResponse;
    throw new Error(error.message || "Failed to close daily stock");
  }

  return data;
}

export function useCloseDailyStock() {
  return useMutation({
    mutationFn: closeDailyStockRequest,
  });
}
