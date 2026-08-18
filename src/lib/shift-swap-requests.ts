import { apiClient } from "@/lib/api-client";
import type { ShiftSwapRequest } from "@/types/hr";

export async function getShiftSwapRequests(): Promise<ShiftSwapRequest[]> {
  return apiClient<ShiftSwapRequest[]>(`/shift-swap-requests`);
}
