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

export type ShiftScheduleSwapStatus =
  | "normal"
  | "swap_pending"
  | "swap_approved";

export interface ShiftSchedule {
  id: string;
  employee_id: string;
  shift_id: string;
  date: string;
  swap_status: ShiftScheduleSwapStatus;
  created_at: string;
  updated_at: string;
  shift?: Shift;
}

export interface CreateShiftSchedulePayload {
  shift_id: string;
  date: string;
}

export type ShiftSwapRequestStatus = "pending" | "approved" | "rejected";

export interface ShiftSwapRequest {
  id: string;
  requester_schedule_id: string;
  target_schedule_id: string;
  status: ShiftSwapRequestStatus;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  requester_schedule?: ShiftSchedule & { employee?: Employee };
  target_schedule?: ShiftSchedule & { employee?: Employee };
}

export interface CreateShiftSwapRequestPayload {
  requester_schedule_id: string;
  target_schedule_id: string;
}

export type AttendanceStatus =
  | "on_time"
  | "late"
  | "sick_with_letter"
  | "sick_without_letter"
  | "leave"
  | "time_off"
  | "absent";

export interface Attendance {
  id: string;
  employee_id: string;
  shift_schedule_id: string | null;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_photo: string | null;
  check_out_photo: string | null;
  location_lat: string | null;
  location_long: string | null;
  late_minutes: number;
  status: AttendanceStatus;
  supporting_document: string | null;
  created_at: string;
  updated_at: string;
}

export interface MarkAttendanceStatusPayload {
  date: string;
  status: Extract<
    AttendanceStatus,
    "sick_with_letter" | "sick_without_letter" | "leave" | "time_off" | "absent"
  >;
}
