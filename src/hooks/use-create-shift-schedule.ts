"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShiftSchedule } from "@/types/hr";

interface CreateShiftSchedulePayload {
  employeeId: string;
  shift_id: string;
  date: string;
}

interface CreateShiftScheduleErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createShiftScheduleRequest(
  payload: CreateShiftSchedulePayload,
): Promise<{ message: string; shift_schedule: ShiftSchedule }> {
  const { employeeId, ...body } = payload;

  const response = await fetch(`/api/employees/${employeeId}/shift-schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateShiftScheduleErrorResponse;
    throw new Error(error.message || "Failed to create shift schedule");
  }

  return data;
}

export function useCreateShiftSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShiftScheduleRequest,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shift-schedules", variables.employeeId],
      });
    },
  });
}
