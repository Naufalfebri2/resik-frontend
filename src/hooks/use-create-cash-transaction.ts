"use client";

import { useMutation } from "@tanstack/react-query";
import type { CashTransaction } from "@/types/inventory";

interface CreateCashTransactionPayload {
  cashAccountId: string;
  date: string;
  type: "in" | "out";
  amount: number;
  notes?: string;
}

interface CreateCashTransactionErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createCashTransactionRequest(
  payload: CreateCashTransactionPayload,
): Promise<{ message: string; cash_transaction: CashTransaction }> {
  const { cashAccountId, ...body } = payload;

  const response = await fetch(
    `/api/finance/cash-accounts/${cashAccountId}/transactions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateCashTransactionErrorResponse;
    throw new Error(error.message || "Failed to create transaction");
  }

  return data;
}

export function useCreateCashTransaction() {
  return useMutation({
    mutationFn: createCashTransactionRequest,
  });
}
