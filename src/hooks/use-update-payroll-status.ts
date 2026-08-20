"use client";

import { useMutation } from "@tanstack/react-query";
import type { PayrollPeriod, PayrollStatus } from "@/types/payroll";

interface UpdatePayrollStatusPayload {
  payrollPeriodId: string;
  status: PayrollStatus;
}

interface UpdatePayrollStatusErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updatePayrollStatusRequest(
  payload: UpdatePayrollStatusPayload,
): Promise<{ message: string; payroll_period: PayrollPeriod }> {
  const { payrollPeriodId, ...body } = payload;

  const response = await fetch(
    `/api/payroll-periods/${payrollPeriodId}/status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdatePayrollStatusErrorResponse;
    throw new Error(error.message || "Failed to update payroll status");
  }

  return data;
}

export function useUpdatePayrollStatus() {
  return useMutation({
    mutationFn: updatePayrollStatusRequest,
  });
}
