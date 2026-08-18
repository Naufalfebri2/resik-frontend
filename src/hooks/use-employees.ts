"use client";

import { useQuery } from "@tanstack/react-query";
import type { Employee } from "@/types/hr";

async function fetchEmployees(sectionId: string): Promise<Employee[]> {
  const response = await fetch(`/api/sections/${sectionId}/employees`);

  if (!response.ok) {
    throw new Error("Failed to load employees");
  }

  return response.json();
}

export function useEmployees(sectionId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["employees", sectionId],
    queryFn: () => fetchEmployees(sectionId),
    enabled,
  });
}
