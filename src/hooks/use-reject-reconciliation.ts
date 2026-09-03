"use client";

import { useMutation } from "@tanstack/react-query";
import type { CashReconciliation } from "@/types/inventory";

interface RejectReconciliationPayload {
  cashAccountId: string;
  reconciliationId: string;
}

interface RejectReconciliationErrorResponse {
  message: string;
}

async function rejectReconciliationRequest({
  cashAccountId,
  reconciliationId,
}: RejectReconciliationPayload): Promise<{
  message: string;
  reconciliation: CashReconciliation;
}> {
  const response = await fetch(
    `/api/finance/cash-accounts/${cashAccountId}/reconciliations/${reconciliationId}/reject`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as RejectReconciliationErrorResponse;
    throw new Error(error.message || "Failed to reject reconciliation");
  }

  return data;
}

export function useRejectReconciliation() {
  return useMutation({
    mutationFn: rejectReconciliationRequest,
  });
}
