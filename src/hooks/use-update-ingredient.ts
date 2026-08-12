"use client";

import { useMutation } from "@tanstack/react-query";
import type { Ingredient, RiskCategory } from "@/types/inventory";

interface UpdateIngredientPayload {
  sectionId: string;
  ingredientId: string;
  name: string;
  unit: string;
  risk_category: RiskCategory;
  alert_threshold: number;
}

interface UpdateIngredientErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateIngredientRequest(
  payload: UpdateIngredientPayload,
): Promise<{ message: string; ingredient: Ingredient }> {
  const { sectionId, ingredientId, ...body } = payload;

  const response = await fetch(
    `/api/sections/${sectionId}/ingredients/${ingredientId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateIngredientErrorResponse;
    throw new Error(error.message || "Failed to update ingredient");
  }

  return data;
}

export function useUpdateIngredient() {
  return useMutation({
    mutationFn: updateIngredientRequest,
  });
}
