import { apiClient } from "@/lib/api-client";
import { getSections } from "@/lib/sections";
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

export async function getIngredientsByOutlet(
  outletId: string,
): Promise<Ingredient[]> {
  const sections = await getSections(outletId);

  const ingredientsPerSection = await Promise.all(
    sections.map((section) => getIngredients(section.id)),
  );

  return ingredientsPerSection.flat();
}
