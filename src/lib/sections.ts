import { apiClient } from "@/lib/api-client";
import type { Section } from "@/types/inventory";

export async function getSections(outletId: string): Promise<Section[]> {
  return apiClient<Section[]>(`/outlets/${outletId}/sections`, {
    revalidate: 60,
  });
}
