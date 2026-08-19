"use client";

import { useMutation } from "@tanstack/react-query";
import type { Employee } from "@/types/hr";

interface MoveEmployeePayload {
  sectionId: string;
  employeeId: string;
  target_section_id: string;
}

interface MoveEmployeeErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function moveEmployeeRequest(
  payload: MoveEmployeePayload,
): Promise<{ message: string; employee: Employee }> {
  const { sectionId, employeeId, ...body } = payload;

  const response = await fetch(
    `/api/sections/${sectionId}/employees/${employeeId}/move`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as MoveEmployeeErrorResponse;
    throw new Error(error.message || "Failed to move employee");
  }

  return data;
}

export function useMoveEmployee() {
  return useMutation({
    mutationFn: moveEmployeeRequest,
  });
}
