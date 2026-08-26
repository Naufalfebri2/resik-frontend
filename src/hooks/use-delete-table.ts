"use client";

import { useMutation } from "@tanstack/react-query";

interface DeleteTableErrorResponse {
  message: string;
}

async function deleteTableRequest(payload: {
  sectionId: string;
  tableId: string;
}): Promise<{ message: string }> {
  const response = await fetch(
    `/api/sections/${payload.sectionId}/tables/${payload.tableId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteTableErrorResponse;
    throw new Error(error.message || "Failed to delete table");
  }

  return data;
}

export function useDeleteTable() {
  return useMutation({
    mutationFn: deleteTableRequest,
  });
}
