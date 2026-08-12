"use client";

import { useMutation } from "@tanstack/react-query";

interface DeleteIngredientPayload {
  sectionId: string;
  ingredientId: string;
}

async function deleteIngredientRequest(
  payload: DeleteIngredientPayload,
): Promise<{ message: string }> {
  const { sectionId, ingredientId } = payload;

  const response = await fetch(
    `/api/sections/${sectionId}/ingredients/${ingredientId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete ingredient");
  }

  return data;
}

export function useDeleteIngredient() {
  return useMutation({
    mutationFn: deleteIngredientRequest,
  });
}
