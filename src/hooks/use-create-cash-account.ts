"use client";

import { useMutation } from "@tanstack/react-query";
import type { CashAccount } from "@/types/inventory";

interface CreateCashAccountPayload {
  outletId: string;
  name: string;
  type: "cash" | "bank";
}

interface CreateCashAccountErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createCashAccountRequest(
  payload: CreateCashAccountPayload,
): Promise<{ message: string; cash_account: CashAccount }> {
  const { outletId, ...body } = payload;

  const response = await fetch(`/api/outlets/${outletId}/cash-accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateCashAccountErrorResponse;
    throw new Error(error.message || "Failed to create cash account");
  }

  return data;
}

export function useCreateCashAccount() {
  return useMutation({
    mutationFn: createCashAccountRequest,
  });
}
