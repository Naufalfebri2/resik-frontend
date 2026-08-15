import { apiClient } from "@/lib/api-client";
import type { Supplier } from "@/types/inventory";

export async function getSuppliers(): Promise<Supplier[]> {
  return apiClient<Supplier[]>("/suppliers");
}
