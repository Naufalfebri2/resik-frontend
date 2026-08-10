import { apiClient } from "@/lib/api-client";
import type { Outlet } from "@/types/inventory";

export async function getOutlets(): Promise<Outlet[]> {
  return apiClient<Outlet[]>("/outlets", { revalidate: 60 });
}
