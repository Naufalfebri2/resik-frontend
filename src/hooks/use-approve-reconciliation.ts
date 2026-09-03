"use client";

import { useMutation } from "@tanstack/react-query";
import type { CashReconciliation } from "@/types/inventory";

interface ApproveReconciliationPayload {
  cashAccountId: string;
  reconciliationId: string;
}

interface ApproveReconciliationErrorResponse {
  message: string;
}

async function approveReconciliationRequest({
  cashAccountId,
  reconciliationId,
}: ApproveReconciliationPayload): Promise<{
  message: string;
  reconciliation: CashReconciliation;
}> {
  const response = await fetch(
    `/api/finance/cash-accounts/${cashAccountId}/reconciliations/${reconciliationId}/approve`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApproveReconciliationErrorResponse;
    throw new Error(error.message || "Failed to approve reconciliation");
  }

  return data;
}

export function useApproveReconciliation() {
  return useMutation({
    mutationFn: approveReconciliationRequest,
  });
}
