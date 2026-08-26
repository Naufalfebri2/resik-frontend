"use client";

import { useMutation } from "@tanstack/react-query";
import type { UpdateTablePayload, Table } from "@/types/orders";

interface UpdateTableErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateTableRequest(payload: {
  sectionId: string;
  tableId: string;
  data: UpdateTablePayload;
}): Promise<{ message: string; table: Table }> {
  const response = await fetch(
    `/api/sections/${payload.sectionId}/tables/${payload.tableId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateTableErrorResponse;
    throw new Error(error.message || "Failed to update table");
  }

  return data;
}

export function useUpdateTable() {
  return useMutation({
    mutationFn: updateTableRequest,
  });
}
