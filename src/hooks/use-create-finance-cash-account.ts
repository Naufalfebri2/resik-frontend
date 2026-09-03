"use client";

import { useMutation } from "@tanstack/react-query";
import type { CashAccount } from "@/types/inventory";

interface CreateFinanceCashAccountPayload {
  outletId: string;
  name: string;
  type: "cash" | "bank";
}

interface CreateFinanceCashAccountErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createFinanceCashAccountRequest(
  payload: CreateFinanceCashAccountPayload,
): Promise<{ message: string; cash_account: CashAccount }> {
  const { outletId, ...body } = payload;

  const response = await fetch(
    `/api/finance/outlets/${outletId}/cash-accounts`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateFinanceCashAccountErrorResponse;
    throw new Error(error.message || "Failed to create cash account");
  }

  return data;
}

export function useCreateFinanceCashAccount() {
  return useMutation({
    mutationFn: createFinanceCashAccountRequest,
  });
}
