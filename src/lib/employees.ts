import { apiClient } from "@/lib/api-client";
import type { Employee } from "@/types/hr";

export async function getEmployees(sectionId: string): Promise<Employee[]> {
  return apiClient<Employee[]>(`/sections/${sectionId}/employees`);
}
