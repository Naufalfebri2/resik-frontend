import { apiClient } from "@/lib/api-client";
import type { StockAdjustment } from "@/types/inventory";

export async function getStockAdjustments(
  ingredientId: string,
): Promise<StockAdjustment[]> {
  return apiClient<StockAdjustment[]>(
    `/ingredients/${ingredientId}/stock-adjustments`,
  );
}
