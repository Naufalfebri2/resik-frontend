"use client";

import { useMutation } from "@tanstack/react-query";
import type { CashAccount } from "@/types/inventory";

interface UpdateFinanceCashAccountPayload {
  outletId: string;
  cashAccountId: string;
  name: string;
  type: "cash" | "bank";
}

interface UpdateFinanceCashAccountErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateFinanceCashAccountRequest(
  payload: UpdateFinanceCashAccountPayload,
): Promise<{ message: string; cash_account: CashAccount }> {
  const { outletId, cashAccountId, ...body } = payload;

  const response = await fetch(
    `/api/finance/outlets/${outletId}/cash-accounts/${cashAccountId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateFinanceCashAccountErrorResponse;
    throw new Error(error.message || "Failed to update cash account");
  }

  return data;
}

export function useUpdateFinanceCashAccount() {
  return useMutation({
    mutationFn: updateFinanceCashAccountRequest,
  });
}
