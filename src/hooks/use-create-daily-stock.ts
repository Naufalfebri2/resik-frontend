"use client";

import { useMutation } from "@tanstack/react-query";
import type { DailyStock } from "@/types/inventory";

interface CreateDailyStockPayload {
  ingredientId: string;
  date: string;
  opening_stock: number;
}

interface CreateDailyStockErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createDailyStockRequest(
  payload: CreateDailyStockPayload,
): Promise<{ message: string; daily_stock: DailyStock }> {
  const { ingredientId, ...body } = payload;

  const response = await fetch(
    `/api/ingredients/${ingredientId}/daily-stocks`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateDailyStockErrorResponse;
    throw new Error(error.message || "Failed to create daily stock");
  }

  return data;
}

export function useCreateDailyStock() {
  return useMutation({
    mutationFn: createDailyStockRequest,
  });
}
