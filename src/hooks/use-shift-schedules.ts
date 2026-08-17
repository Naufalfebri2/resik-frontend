"use client";

import { useQuery } from "@tanstack/react-query";
import type { ShiftSchedule } from "@/types/hr";

async function fetchShiftSchedules(
  employeeId: string,
): Promise<ShiftSchedule[]> {
  const response = await fetch(`/api/employees/${employeeId}/shift-schedules`);

  if (!response.ok) {
    throw new Error("Failed to load shift schedules");
  }

  return response.json();
}

export function useShiftSchedules(employeeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["shift-schedules", employeeId],
    queryFn: () => fetchShiftSchedules(employeeId),
    enabled,
  });
}
