import { apiClient } from "@/lib/api-client";
import type { Tenant } from "@/types/tenant";

export async function getTenant(): Promise<Tenant> {
  return apiClient<Tenant>("/tenant");
}
