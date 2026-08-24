import { apiClient } from "@/lib/api-client";
import type { OutletStaffMember } from "@/types/orders";

export async function getOutletStaff(
  outletId: string,
): Promise<OutletStaffMember[]> {
  return apiClient<OutletStaffMember[]>(`/outlets/${outletId}/users`);
}
