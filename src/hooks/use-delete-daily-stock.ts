"use client";

import { useMutation } from "@tanstack/react-query";

interface DeleteDailyStockPayload {
  ingredientId: string;
  dailyStockId: string;
}

interface DeleteDailyStockErrorResponse {
  message: string;
}

async function deleteDailyStockRequest(
  payload: DeleteDailyStockPayload,
): Promise<{ message: string }> {
  const { ingredientId, dailyStockId } = payload;

  const response = await fetch(
    `/api/ingredients/${ingredientId}/daily-stocks/${dailyStockId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteDailyStockErrorResponse;
    throw new Error(error.message || "Failed to delete daily stock");
  }

  return data;
}

export function useDeleteDailyStock() {
  return useMutation({
    mutationFn: deleteDailyStockRequest,
  });
}
