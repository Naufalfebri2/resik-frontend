"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Attendance, MarkAttendanceStatusPayload } from "@/types/hr";

interface MarkAttendanceStatusRequestPayload extends MarkAttendanceStatusPayload {
  employeeId: string;
}

interface MarkAttendanceStatusErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function markAttendanceStatusRequest(
  payload: MarkAttendanceStatusRequestPayload,
): Promise<{ message: string; attendance: Attendance }> {
  const { employeeId, ...body } = payload;

  const response = await fetch(
    `/api/employees/${employeeId}/attendance/mark-status`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as MarkAttendanceStatusErrorResponse;
    throw new Error(error.message || "Failed to mark attendance status");
  }

  return data;
}

export function useMarkAttendanceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAttendanceStatusRequest,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.employeeId],
      });
    },
  });
}
