export type UserRole = "owner" | "admin" | "manager" | "staf";

export interface User {
  id: string;
  tenant_id: string;
  outlet_id: string | null;
  email: string;
  role: UserRole;
  employee_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  business_name: string;
  plan: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  tenant: Tenant;
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
