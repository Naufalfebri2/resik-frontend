import { apiClient } from "@/lib/api-client";
import type { DailyStock, StockOutflow } from "@/types/inventory";

export async function getDailyStocks(
  ingredientId: string,
): Promise<DailyStock[]> {
  return apiClient<DailyStock[]>(`/ingredients/${ingredientId}/daily-stocks`);
}

export async function getStockOutflows(
  dailyStockId: string,
): Promise<StockOutflow[]> {
  return apiClient<StockOutflow[]>(`/daily-stocks/${dailyStockId}/outflows`);
}
