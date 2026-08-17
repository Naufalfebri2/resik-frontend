"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteShiftSchedulePayload {
  employeeId: string;
  scheduleId: string;
}

interface DeleteShiftScheduleErrorResponse {
  message: string;
}

async function deleteShiftScheduleRequest(
  payload: DeleteShiftSchedulePayload,
): Promise<{ message: string }> {
  const { employeeId, scheduleId } = payload;

  const response = await fetch(
    `/api/employees/${employeeId}/shift-schedules/${scheduleId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteShiftScheduleErrorResponse;
    throw new Error(error.message || "Failed to delete shift schedule");
  }

  return data;
}

export function useDeleteShiftSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShiftScheduleRequest,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shift-schedules", variables.employeeId],
      });
    },
  });
}
