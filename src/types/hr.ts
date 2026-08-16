import type { Section } from "@/types/inventory";

export type EmployeeRole = "staff" | "admin" | "owner";

export type CustomFieldType = "text" | "number" | "date" | "boolean" | "select";

export interface CustomFieldDefinition {
  id: string;
  tenant_id: string;
  entity_type: "ingredients" | "employees" | "menus";
  field_name: string;
  field_type: CustomFieldType;
  select_options: string[] | null;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export type CustomFieldValue = string | number | boolean | null;

export interface Employee {
  id: string;
  section_id: string;
  name: string;
  phone: string;
  role: EmployeeRole;
  start_date: string;
  base_salary: string;
  remaining_leave_quota: number;
  is_active: boolean;
  custom_fields: Record<string, CustomFieldValue> | null;
  created_at: string;
  updated_at: string;
  section?: Section;
}

export interface CreateEmployeePayload {
  name: string;
  phone: string;
  role: EmployeeRole;
  start_date: string;
  base_salary: number;
  custom_fields?: Record<string, CustomFieldValue>;
}

export interface UpdateEmployeePayload {
  name?: string;
  phone?: string;
  role?: EmployeeRole;
  base_salary?: number;
  is_active?: boolean;
  custom_fields?: Record<string, CustomFieldValue>;
}

export interface Shift {
  id: string;
  section_id: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface CreateShiftPayload {
  shift_name: string;
  start_time: string;
  end_time: string;
}

export interface UpdateShiftPayload {
  shift_name?: string;
  start_time?: string;
  end_time?: string;
}
