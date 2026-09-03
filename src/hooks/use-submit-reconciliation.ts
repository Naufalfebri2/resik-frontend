"use client";

import { useMutation } from "@tanstack/react-query";
import type { CashReconciliation } from "@/types/inventory";

interface SubmitReconciliationPayload {
  cashAccountId: string;
  physical_balance: number;
  notes?: string;
}

interface SubmitReconciliationErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function submitReconciliationRequest(
  payload: SubmitReconciliationPayload,
): Promise<{ message: string; reconciliation: CashReconciliation }> {
  const { cashAccountId, ...body } = payload;

  const response = await fetch(
    `/api/finance/cash-accounts/${cashAccountId}/reconciliations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as SubmitReconciliationErrorResponse;
    throw new Error(error.message || "Failed to submit reconciliation");
  }

  return data;
}

export function useSubmitReconciliation() {
  return useMutation({
    mutationFn: submitReconciliationRequest,
  });
}
