"use client";

import { useQuery } from "@tanstack/react-query";
import type { Attendance } from "@/types/hr";

async function fetchAttendance(employeeId: string): Promise<Attendance[]> {
  const response = await fetch(`/api/employees/${employeeId}/attendance`);

  if (!response.ok) {
    throw new Error("Failed to load attendance records");
  }

  return response.json();
}

export function useAttendance(employeeId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["attendance", employeeId],
    queryFn: () => fetchAttendance(employeeId),
    enabled,
  });
}
