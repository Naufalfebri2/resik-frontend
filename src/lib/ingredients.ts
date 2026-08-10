import { apiClient } from "@/lib/api-client";
import type { Ingredient, LowStockIngredient } from "@/types/inventory";

export async function getIngredients(sectionId: string): Promise<Ingredient[]> {
  return apiClient<Ingredient[]>(`/sections/${sectionId}/ingredients`);
}

export async function getLowStockIngredients(): Promise<LowStockIngredient[]> {
  return apiClient<LowStockIngredient[]>("/ingredients/low-stock");
}
