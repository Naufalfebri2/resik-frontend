"use client";

import { useMutation } from "@tanstack/react-query";

interface DeleteFinanceCashAccountPayload {
  outletId: string;
  cashAccountId: string;
}

interface DeleteFinanceCashAccountErrorResponse {
  message: string;
}

async function deleteFinanceCashAccountRequest({
  outletId,
  cashAccountId,
}: DeleteFinanceCashAccountPayload): Promise<{ message: string }> {
  const response = await fetch(
    `/api/finance/outlets/${outletId}/cash-accounts/${cashAccountId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteFinanceCashAccountErrorResponse;
    throw new Error(error.message || "Failed to delete cash account");
  }

  return data;
}

export function useDeleteFinanceCashAccount() {
  return useMutation({
    mutationFn: deleteFinanceCashAccountRequest,
  });
}
