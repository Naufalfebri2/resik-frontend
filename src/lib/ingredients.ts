import { apiClient } from "@/lib/api-client";
import type {
  Ingredient,
  IngredientDetail,
  LowStockIngredient,
} from "@/types/inventory";

export async function getIngredients(sectionId: string): Promise<Ingredient[]> {
  return apiClient<Ingredient[]>(`/sections/${sectionId}/ingredients`);
}

export async function getLowStockIngredients(): Promise<LowStockIngredient[]> {
  return apiClient<LowStockIngredient[]>("/ingredients/low-stock");
}

export async function getIngredient(
  ingredientId: string,
): Promise<IngredientDetail> {
  return apiClient<IngredientDetail>(`/ingredients/${ingredientId}`);
}
