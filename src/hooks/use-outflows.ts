"use client";

import { useQuery } from "@tanstack/react-query";
import type { StockOutflow } from "@/types/inventory";

async function fetchOutflows(dailyStockId: string): Promise<StockOutflow[]> {
  const response = await fetch(`/api/daily-stocks/${dailyStockId}/outflows`);

  if (!response.ok) {
    throw new Error("Failed to load stock outflows");
  }

  return response.json();
}

export function useOutflows(dailyStockId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["outflows", dailyStockId],
    queryFn: () => fetchOutflows(dailyStockId),
    enabled,
  });
}
