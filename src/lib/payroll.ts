import { apiClient } from "@/lib/api-client";
import type { PayrollPeriod } from "@/types/payroll";

export async function getPayrollPeriods(
  month: string,
): Promise<PayrollPeriod[]> {
  return apiClient<PayrollPeriod[]>(`/payroll-periods?month=${month}`);
}

export async function getPayrollPeriod(
  payrollPeriodId: string,
): Promise<PayrollPeriod> {
  return apiClient<PayrollPeriod>(`/payroll-periods/${payrollPeriodId}`);
}
