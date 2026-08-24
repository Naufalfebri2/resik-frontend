import { apiClient } from "@/lib/api-client";
import type { Table } from "@/types/orders";

export async function getTables(sectionId: string): Promise<Table[]> {
  return apiClient<Table[]>(`/sections/${sectionId}/tables`, {
    revalidate: 60,
  });
}
