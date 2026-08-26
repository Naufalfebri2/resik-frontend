"use client";

import { useMutation } from "@tanstack/react-query";
import type { CreateTablePayload, Table } from "@/types/orders";

interface CreateTableErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createTableRequest(payload: {
  sectionId: string;
  data: CreateTablePayload;
}): Promise<{ message: string; table: Table }> {
  const response = await fetch(`/api/sections/${payload.sectionId}/tables`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.data),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateTableErrorResponse;
    throw new Error(error.message || "Failed to create table");
  }

  return data;
}

export function useCreateTable() {
  return useMutation({
    mutationFn: createTableRequest,
  });
}
