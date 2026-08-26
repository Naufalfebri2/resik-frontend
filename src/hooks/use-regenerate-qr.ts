"use client";

import { useMutation } from "@tanstack/react-query";
import type { Table } from "@/types/orders";

interface RegenerateQrErrorResponse {
  message: string;
}

async function regenerateQrRequest(payload: {
  sectionId: string;
  tableId: string;
}): Promise<{ message: string; table: Table }> {
  const response = await fetch(
    `/api/sections/${payload.sectionId}/tables/${payload.tableId}/regenerate-qr`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as RegenerateQrErrorResponse;
    throw new Error(error.message || "Failed to regenerate QR code");
  }

  return data;
}

export function useRegenerateQr() {
  return useMutation({
    mutationFn: regenerateQrRequest,
  });
}
