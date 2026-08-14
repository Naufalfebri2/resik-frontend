"use client";

import { useMutation } from "@tanstack/react-query";
import type { DailyStock } from "@/types/inventory";

interface UpdateDailyStockPayload {
  ingredientId: string;
  dailyStockId: string;
  opening_stock: number;
}

interface UpdateDailyStockErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateDailyStockRequest(
  payload: UpdateDailyStockPayload,
): Promise<{ message: string; daily_stock: DailyStock }> {
  const { ingredientId, dailyStockId, ...body } = payload;

  const response = await fetch(
    `/api/ingredients/${ingredientId}/daily-stocks/${dailyStockId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateDailyStockErrorResponse;
    throw new Error(error.message || "Failed to update daily stock");
  }

  return data;
}

export function useUpdateDailyStock() {
  return useMutation({
    mutationFn: updateDailyStockRequest,
  });
}
