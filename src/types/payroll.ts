import type { Employee } from "@/types/hr";

export type PayrollStatus = "draft" | "final" | "paid";

export interface PayrollPeriod {
  id: string;
  employee_id: string;
  month: string;
  base_salary: string;
  total_late_deduction: string;
  total_absence_deduction: string;
  net_salary: string;
  status: PayrollStatus;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export interface GeneratePayrollPayload {
  month: string;
}

export interface UpdatePayrollStatusPayload {
  status: PayrollStatus;
}
