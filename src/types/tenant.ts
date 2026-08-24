export interface TenantSettings {
  service_charge_percentage?: number;
  [key: string]: unknown;
}

export interface Tenant {
  id: string;
  business_name: string;
  plan: string;
  settings: TenantSettings | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateTenantSettingsPayload {
  settings: Partial<TenantSettings>;
}
