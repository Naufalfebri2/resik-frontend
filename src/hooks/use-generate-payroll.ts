"use client";

import { useMutation } from "@tanstack/react-query";
import type { GeneratePayrollPayload, PayrollPeriod } from "@/types/payroll";

interface GeneratePayrollErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function generatePayrollRequest(
  payload: GeneratePayrollPayload,
): Promise<{ message: string; payroll_periods: PayrollPeriod[] }> {
  const response = await fetch("/api/payroll-periods/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as GeneratePayrollErrorResponse;
    throw new Error(error.message || "Failed to generate payroll");
  }

  return data;
}

export function useGeneratePayroll() {
  return useMutation({
    mutationFn: generatePayrollRequest,
  });
}
