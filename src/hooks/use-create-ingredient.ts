"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Ingredient, RiskCategory } from "@/types/inventory";

interface CreateIngredientPayload {
  sectionId: string;
  name: string;
  unit: string;
  risk_category: RiskCategory;
  alert_threshold: number;
}

interface CreateIngredientErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createIngredientRequest(
  payload: CreateIngredientPayload,
): Promise<{ message: string; ingredient: Ingredient }> {
  const { sectionId, ...body } = payload;

  const response = await fetch(`/api/sections/${sectionId}/ingredients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateIngredientErrorResponse;
    throw new Error(error.message || "Failed to create ingredient");
  }

  return data;
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIngredientRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
}
