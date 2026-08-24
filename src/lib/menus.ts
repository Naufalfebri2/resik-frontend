import { apiClient } from "@/lib/api-client";
import type { Menu } from "@/types/orders";

export async function getMenus(outletId: string): Promise<Menu[]> {
  return apiClient<Menu[]>(`/outlets/${outletId}/menus`, { revalidate: 60 });
}
