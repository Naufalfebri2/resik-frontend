"use client";

import { useQuery } from "@tanstack/react-query";
import type { Shift } from "@/types/hr";

async function fetchShifts(sectionId: string): Promise<Shift[]> {
  const response = await fetch(`/api/sections/${sectionId}/shifts`);

  if (!response.ok) {
    throw new Error("Failed to load shifts");
  }

  return response.json();
}

export function useShifts(sectionId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["shifts", sectionId],
    queryFn: () => fetchShifts(sectionId),
    enabled,
  });
}
