import { apiClient } from "@/lib/api-client";
import type { Shift } from "@/types/hr";

export async function getShifts(sectionId: string): Promise<Shift[]> {
  return apiClient<Shift[]>(`/sections/${sectionId}/shifts`);
}
