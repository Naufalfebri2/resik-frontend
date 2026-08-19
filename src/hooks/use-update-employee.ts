"use client";

import { useMutation } from "@tanstack/react-query";
import type { CustomFieldValue, Employee } from "@/types/hr";

interface UpdateEmployeePayload {
  sectionId: string;
  employeeId: string;
  name: string;
  phone: string;
  role: string;
  base_salary: number;
  is_active: boolean;
  custom_fields: Record<string, CustomFieldValue>;
}

interface UpdateEmployeeErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateEmployeeRequest(
  payload: UpdateEmployeePayload,
): Promise<{ message: string; employee: Employee }> {
  const { sectionId, employeeId, ...body } = payload;

  const response = await fetch(
    `/api/sections/${sectionId}/employees/${employeeId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateEmployeeErrorResponse;
    throw new Error(error.message || "Failed to update employee");
  }

  return data;
}

export function useUpdateEmployee() {
  return useMutation({
    mutationFn: updateEmployeeRequest,
  });
}
